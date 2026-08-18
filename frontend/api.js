// Client mínimo para a V1. As chaves públicas do Supabase podem ficar no frontend;
// nenhuma service-role key deve ser colocada aqui.
const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

export async function criarSolicitacao({ tipoEntidade, dadosContratacao }) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase ainda não configurado neste ambiente.');
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/solicitacoes_contratacao`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({
      tipo_entidade: tipoEntidade,
      status: 'aguardando_dados',
      dados_contratacao: dadosContratacao
    })
  });

  if (!response.ok) {
    throw new Error(`Falha ao salvar solicitação (${response.status}).`);
  }

  return response.json();
}
