const BUCKET = 'documentos-solicitacoes';
const headers=()=>({apikey:window.SUPABASE_ANON_KEY,Authorization:`Bearer ${window.SUPABASE_ANON_KEY}`,'Content-Type':'application/json'});

export async function uploadDocumentos(solicitacaoId, file) {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) throw new Error('Supabase não configurado neste ambiente.');
  const safeName=file.name.replace(/[^a-zA-Z0-9._ -]/g,'_');
  const path=`${solicitacaoId}/${crypto.randomUUID()}-${safeName}`;
  const uploadResponse=await fetch(`${window.SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g,'/')}`,{method:'POST',headers:{apikey:window.SUPABASE_ANON_KEY,Authorization:`Bearer ${window.SUPABASE_ANON_KEY}`,'Content-Type':file.type||'application/octet-stream','x-upsert':'false'},body:file});
  if(!uploadResponse.ok) throw new Error(`Falha no upload de ${file.name}: ${await uploadResponse.text()}`);
  const dbResponse=await fetch(`${window.SUPABASE_URL}/rest/v1/solicitacao_documentos`,{method:'POST',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify({solicitacao_id:solicitacaoId,nome_original:file.name,caminho_storage:path,tipo_mime:file.type||null,tamanho_bytes:file.size,status:'recebido'})});
  if(!dbResponse.ok) throw new Error(`Arquivo enviado, mas não foi possível registrar ${file.name} no banco.`);
  const rows=await dbResponse.json();
  return {path,name:file.name,id:rows[0]?.id};
}

export async function atualizarOCR(documentoId,{texto,dados,status='extraido',confianca=0.9,erro=null}){
  const response=await fetch(`${window.SUPABASE_URL}/rest/v1/solicitacao_documentos?id=eq.${encodeURIComponent(documentoId)}`,{method:'PATCH',headers:{...headers(),Prefer:'return=minimal'},body:JSON.stringify({texto_extraido:texto,dados_extraidos:dados,status,confianca,erro})});
  if(!response.ok) throw new Error(`Não foi possível salvar o resultado do OCR: ${await response.text()}`);
}

export async function atualizarStatusSolicitacao(id,status){
  const response=await fetch(`${window.SUPABASE_URL}/rest/v1/solicitacoes_contratacao?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{...headers(),Prefer:'return=minimal'},body:JSON.stringify({status})});
  if(!response.ok) throw new Error(`Não foi possível atualizar a solicitação: ${await response.text()}`);
}
