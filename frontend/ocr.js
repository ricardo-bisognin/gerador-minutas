import { createWorker } from 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js';
import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

const CPF_RE = /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}\b/g;
const CNPJ_RE = /\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[\/\s]?\d{4}[-\s]?\d{2}\b/g;
const CEP_RE = /\b\d{5}[-\s]?\d{3}\b/g;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const DATE_RE = /\b(?:0?[1-9]|[12]\d|3[01])[./-](?:0?[1-9]|1[0-2])[./-](?:19|20)\d{2}\b/g;

function digits(value){ return (value || '').replace(/\D/g,''); }
function validCpf(value){
  const c=digits(value); if(c.length!==11 || /^(\d)\1+$/.test(c)) return false;
  let sum=0; for(let i=0;i<9;i++) sum+=Number(c[i])*(10-i);
  let d1=(sum*10)%11; if(d1===10)d1=0; if(d1!==Number(c[9]))return false;
  sum=0; for(let i=0;i<10;i++)sum+=Number(c[i])*(11-i);
  let d2=(sum*10)%11; if(d2===10)d2=0; return d2===Number(c[10]);
}
function validCnpj(value){
  const c=digits(value); if(c.length!==14 || /^(\d)\1+$/.test(c))return false;
  const calc=(len)=>{let sum=0;let p=len-7;for(let i=0;i<len;i++){sum+=Number(c[i])*p;p--;if(p<2)p=9}let d=11-(sum%11);return d>=10?0:d};
  return calc(12)===Number(c[12]) && calc(13)===Number(c[13]);
}
function unique(items){return [...new Set(items.map(x=>x.trim()).filter(Boolean))]}

export function extractStructuredData(text){
  const cpfs=unique((text.match(CPF_RE)||[]).filter(validCpf));
  const cnpjs=unique((text.match(CNPJ_RE)||[]).filter(validCnpj));
  const ceps=unique(text.match(CEP_RE)||[]);
  const emails=unique(text.match(EMAIL_RE)||[]);
  const dates=unique(text.match(DATE_RE)||[]);
  const context=[];
  const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const labels=[['cpf',/(?:CPF|C\.P\.F\.?)/i],['cnpj',/(?:CNPJ|C\.N\.P\.J\.?)/i],['razao_social',/(?:raz[aã]o\s+social|denomina[cç][aã]o)/i],['representante',/(?:representante\s+legal|administrador(?:a)?|s[oó]cio(?:-administrador)?)/i],['endereco',/(?:endere[cç]o|logradouro)/i]];
  for(const line of lines){ for(const [key,re] of labels){ if(re.test(line)) context.push({campo:key,linha:line}); } }
  return {cpfs,cnpjs,ceps,emails,dates,context};
}

async function recognizeImage(worker, source, onProgress){
  const result=await worker.recognize(source, {}, { blocks: true });
  if(onProgress) onProgress(result.data.progress || 1);
  return result.data.text || '';
}

async function pdfToImages(file){
  const data=new Uint8Array(await file.arrayBuffer());
  const pdf=await pdfjsLib.getDocument({data}).promise;
  const pages=[];
  for(let n=1;n<=pdf.numPages;n++){
    const page=await pdf.getPage(n);
    const viewport=page.getViewport({scale:2});
    const canvas=document.createElement('canvas');
    canvas.width=Math.ceil(viewport.width); canvas.height=Math.ceil(viewport.height);
    await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
    pages.push(canvas);
  }
  return pages;
}

export async function ocrFile(file,onProgress){
  const worker=await createWorker('por');
  try{
    let text='';
    if(file.type==='application/pdf' || file.name.toLowerCase().endsWith('.pdf')){
      const pages=await pdfToImages(file);
      for(let i=0;i<pages.length;i++){
        text += `\n--- PÁGINA ${i+1} ---\n`;
        text += await recognizeImage(worker,pages[i],p=>onProgress?.((i+p)/pages.length));
      }
    }else{
      text=await recognizeImage(worker,file,onProgress);
    }
    return {text, dados:extractStructuredData(text)};
  }finally{
    await worker.terminate();
  }
}
