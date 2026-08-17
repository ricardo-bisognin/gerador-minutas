import { createClient } from '@supabase/supabase-js';
import './style.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const drpps = [
  [1,'1ª DRPP','Canoas','Vale dos Sinos e Litoral'],[2,'2ª DRPP','Santa Maria','Região Central'],
  [3,'3ª DRPP','Santo Ângelo','Missões e Noroeste'],[4,'4ª DRPP','Passo Fundo','Alto Uruguai'],
  [5,'5ª DRPP','Pelotas','Sul'],[6,'6ª DRPP','Santana do Livramento','Campanha'],
  [7,'7ª DRPP','Caxias do Sul','Serra'],[8,'8ª DRPP','Santa Cruz do Sul','Vale do Rio Pardo'],
  [9,'9ª DRPP','Charqueadas','Carbonífera'],[10,'10ª DRPP','Porto Alegre','Porto Alegre']
];

const suggestions = ['Roçada','Capina','Jardinagem','Limpeza e conservação','Manutenção predial','Pintura','Serviços gerais'];
let activities = [];
let selectedEstablishments = [];
let establishments = [];

function normalizeActivity(value) {
  return value.trim().replace(/\s+/g, ' ').replace(/(^|[.!?]\s+)([a-zà-ÿ])/g, (_, p, c) => p + c.toUpperCase()).replace(/^([a-zà-ÿ])/u, (_, c) => c.toUpperCase()).replace(/\b(da|de|do|das|dos|e|em|na|no)\b/gi, m => m.toLowerCase());
}

function render() {
  document.querySelector('#app').innerHTML = `
    <main class="shell">
      <header><div><span class="eyebrow">GERADOR DE MINUTAS</span><h1>Termo de Cooperação</h1><p>Utilização de mão de obra prisional</p></div><span class="badge">MVP</span></header>
      <section class="card">
        <h2>1. Identificação</h2>
        <div class="grid">
          <label>Tipo de convenente<select id="tipo"><option value="empresa">Empresa</option><option value="municipio">Município</option></select></label>
          <label>Razão social / nome<input id="nome" placeholder="Nome da empresa ou município"></label>
          <label>CNPJ<input id="cnpj" placeholder="00.000.000/0000-00"></label>
          <label>Responsável<input id="responsavel" placeholder="Nome do responsável legal"></label>
          <label class="pending">FPE <span>🟡</span><input id="fpe" placeholder="Número do FPE, quando existir"></label>
          <label class="pending">Ano do FPE <span>🟡</span><input id="fpe_ano" type="number" placeholder="2026"></label>
          <label class="pending">Processo PROA <span>🟡</span><input id="processo" placeholder="Número do processo, quando existir"></label>
        </div>
      </section>
      <section class="card">
        <h2>2. Contratação</h2>
        <div class="grid">
          <label>Quantidade de pessoas<input id="quantidade" type="number" min="1" placeholder="Ex.: 10"></label>
          <label>Local de prestação<select id="local"><option value="sede_empresa">Na sede da empresa</option><option value="sede_estabelecimento_prisional">Na sede do estabelecimento prisional</option><option value="outro">Outro</option></select></label>
          <label id="outroWrap" class="wide hidden">Descreva o outro local<input id="outro" placeholder="Informe o local"></label>
        </div>
        <div class="subsection"><h3>Estabelecimentos penais</h3><div class="region-grid">${drpps.map(([id,n,s,d]) => `<button class="region" data-region="${id}"><strong>${n}</strong><span>${d}</span><small>Sede: ${s}</small></button>`).join('')}</div>
        <div class="search"><input id="estSearch" placeholder="Pesquisar estabelecimento pelo nome ou município"><div id="estResults"></div></div><div id="selected" class="chips"></div></div>
        <div class="subsection"><h3>Atividades</h3><div class="activity-row"><input id="activity" list="activitySuggestions" placeholder="Digite a atividade, ex.: roçada"><datalist id="activitySuggestions">${suggestions.map(x=>`<option value="${x}">`).join('')}</datalist><button id="addActivity">Adicionar</button></div><div id="activities" class="chips"></div></div>
      </section>
      <section class="card">
        <h2>3. Jornada e remuneração</h2>
        <div class="grid">
          <label>Início<input id="inicio" type="time" value="08:00"></label><label>Término<input id="fim" type="time" value="17:00"></label>
          <label>Início do intervalo<input id="intInicio" type="time" value="12:00"></label><label>Fim do intervalo<input id="intFim" type="time" value="13:00"></label>
          <label>Horas por dia<input id="horasDia" type="number" min="0" max="24" step="0.5" value="8"></label><label>Dias trabalhados/semana<input id="dias" type="number" min="1" max="7" value="5"></label>
          <label class="wide">Remuneração<input id="remuneracao" placeholder="100% do salário mínimo nacional vigente"></label>
        </div>
        <div id="jornadaAlert" class="alert hidden"></div>
      </section>
      <section class="card">
        <h2>4. Vigência</h2>
        <div class="grid"><label>Vigência (anos)<input id="vigencia" type="number" min="0.1" step="0.1" value="5"></label><label id="justWrap" class="wide hidden">Justificativa obrigatória<input id="justificativa" placeholder="Justifique a adoção de prazo inferior a 5 anos"></label></div>
        <div id="vigAlert" class="alert hidden"></div>
      </section>
      <section class="actions"><button id="save" class="primary">Salvar solicitação</button><span id="status"></span></section>
    </main>`;

  bind(); loadEstablishments();
}

function bind() {
  document.querySelector('#local').onchange = e => document.querySelector('#outroWrap').classList.toggle('hidden', e.target.value !== 'outro');
  document.querySelector('#vigencia').oninput = updateVigencia;
  document.querySelector('#horasDia').oninput = updateJornada;
  document.querySelector('#dias').oninput = updateJornada;
  document.querySelector('#addActivity').onclick = addActivity;
  document.querySelector('#activity').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addActivity(); } });
  document.querySelector('#estSearch').oninput = filterEstablishments;
  document.querySelectorAll('.region').forEach(b => b.onclick = () => filterEstablishments(null, Number(b.dataset.region)));
  document.querySelector('#save').onclick = save;
  updateVigencia(); updateJornada();
}

async function loadEstablishments() {
  if (!supabase) return;
  const { data, error } = await supabase.from('tc_estabelecimentos_penais').select('id,nome,municipio,drpp_id').eq('ativo', true).order('nome');
  if (!error) { establishments = data || []; }
}

function filterEstablishments(e, regionId = null) {
  const q = e ? e.target.value.toLowerCase().trim() : document.querySelector('#estSearch').value.toLowerCase().trim();
  const rows = establishments.filter(x => (!regionId || x.drpp_id === regionId) && (!q || `${x.nome} ${x.municipio || ''}`.toLowerCase().includes(q))).slice(0, 20);
  document.querySelector('#estResults').innerHTML = rows.map(x => `<button class="result" data-id="${x.id}"><strong>${x.nome}</strong><span>${x.municipio || ''}</span></button>`).join('');
  document.querySelectorAll('.result').forEach(b => b.onclick = () => selectEstablishment(b.dataset.id));
}
function selectEstablishment(id) { if (!selectedEstablishments.includes(id)) selectedEstablishments.push(id); renderSelected(); }
function renderSelected() { document.querySelector('#selected').innerHTML = selectedEstablishments.map(id => { const x = establishments.find(y => y.id === id); return `<span class="chip">${x?.nome || id}<button data-remove="${id}">×</button></span>`; }).join(''); document.querySelectorAll('[data-remove]').forEach(b => b.onclick = () => { selectedEstablishments = selectedEstablishments.filter(id => id !== b.dataset.remove); renderSelected(); }); }
function addActivity() { const input = document.querySelector('#activity'); const v = normalizeActivity(input.value); if (!v) return; activities.push(v); input.value=''; renderActivities(); }
function renderActivities() { document.querySelector('#activities').innerHTML = activities.map((x,i)=>`<span class="chip">${x}<button data-act="${i}">×</button></span>`).join(''); document.querySelectorAll('[data-act]').forEach(b=>b.onclick=()=>{activities.splice(Number(b.dataset.act),1);renderActivities();}); }
function updateVigencia() { const n = Number(document.querySelector('#vigencia').value || 5); const low = n < 5; document.querySelector('#justWrap').classList.toggle('hidden', !low); const a=document.querySelector('#vigAlert'); a.classList.toggle('hidden',!low); if(low) {a.className='alert warning'; a.textContent='⚠️ Vigência inferior a 5 anos. A justificativa será obrigatória antes da submissão.';} }
function updateJornada() { const h=Number(document.querySelector('#horasDia').value||0), d=Number(document.querySelector('#dias').value||0), weekly=h*d; const a=document.querySelector('#jornadaAlert'); const bad=h<6||h>8||weekly>44; a.classList.toggle('hidden',!bad); if(bad){a.className='alert warning';a.textContent=`⚠️ Jornada informada: ${h} h/dia e ${weekly} h/semana. O sistema permitirá prosseguir, mas a situação deverá ser analisada no processo administrativo.`;} }

async function save() {
  const status=document.querySelector('#status');
  if(!supabase){status.textContent='Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.';return;}
  const vig=Number(document.querySelector('#vigencia').value||5), just=document.querySelector('#justificativa')?.value?.trim();
  if(vig<5 && !just){status.textContent='Informe a justificativa para vigência inferior a 5 anos.';return;}
  const payload={tipo_convenente:document.querySelector('#tipo').value,fpe_numero:document.querySelector('#fpe').value.trim()||null,fpe_ano:Number(document.querySelector('#fpe_ano').value)||null,processo_numero:document.querySelector('#processo').value.trim()||null,quantidade_pessoas:Number(document.querySelector('#quantidade').value)||null,local_prestacao_tipo:document.querySelector('#local').value,local_prestacao_outro:document.querySelector('#outro').value.trim()||null,jornada_inicio:document.querySelector('#inicio').value,jornada_fim:document.querySelector('#fim').value,intervalo_inicio:document.querySelector('#intInicio').value,intervalo_fim:document.querySelector('#intFim').value,jornada_semanal_minutos:Math.round(Number(document.querySelector('#horasDia').value||0)*Number(document.querySelector('#dias').value||0)*60),remuneracao_texto:document.querySelector('#remuneracao').value.trim()||null,vigencia_anos:vig,vigencia_justificativa:just||null};
  const {data,error}=await supabase.from('tc_solicitacoes').insert(payload).select('id').single();
  if(error){status.textContent=`Erro: ${error.message}`;return;}
  if(activities.length) await supabase.from('tc_solicitacao_atividades').insert(activities.map((descricao,ordem)=>({solicitacao_id:data.id,descricao,ordem:ordem+1})));
  if(selectedEstablishments.length) await supabase.from('tc_solicitacao_estabelecimentos').insert(selectedEstablishments.map(estabelecimento_id=>({solicitacao_id:data.id,estabelecimento_id})));
  status.textContent=`Solicitação ${data.id} salva.`;
}

render();
