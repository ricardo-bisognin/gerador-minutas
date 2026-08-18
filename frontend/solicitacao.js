const TIPO_EMPRESA = 'empresa';
const TIPO_ORGAO_PUBLICO = 'orgao_publico';

const camposNegociais = [
  'estabelecimento_prisional',
  'atividade',
  'quantidade_trabalhadores',
  'local_prestacao',
  'local_prestacao_outro',
  'remuneracao',
  'dias_trabalhados',
  'horas_diarias',
  'vigencia_anos',
];

function criarSolicitacao(dadosQualificacao, dadosNegociais) {
  return {
    qualificacao: dadosQualificacao,
    negociacao: normalizarDadosNegociais(dadosNegociais),
    saidas: ['carta_proposta', 'termo_cooperacao', 'plano_trabalho'],
  };
}

function normalizarDadosNegociais(dados) {
  return {
    estabelecimento_prisional: dados.estabelecimento_prisional ?? '',
    atividade: capitalizarAtividade(dados.atividade ?? ''),
    quantidade_trabalhadores: dados.quantidade_trabalhadores ?? null,
    local_prestacao: dados.local_prestacao ?? '',
    local_prestacao_outro: dados.local_prestacao_outro ?? '',
    remuneracao: dados.remuneracao ?? '',
    dias_trabalhados: dados.dias_trabalhados ?? [],
    horas_diarias: dados.horas_diarias ?? null,
    vigencia_anos: dados.vigencia_anos ?? 5,
  };
}

function capitalizarAtividade(texto) {
  const valor = texto.trim().replace(/\s+/g, ' ');
  if (!valor) return '';
  return valor.charAt(0).toUpperCase() + valor.slice(1);
}

function compararCamposDocumentais(documentos) {
  const porCampo = new Map();
  for (const documento of documentos) {
    for (const campo of documento.campos ?? []) {
      if (!campo.nome || campo.valor == null || campo.valor === '') continue;
      if (!porCampo.has(campo.nome)) porCampo.set(campo.nome, []);
      porCampo.get(campo.nome).push({
        valor: campo.valor,
        documento: documento.nome,
        confianca: campo.confianca ?? null,
      });
    }
  }

  const resultado = [];
  for (const [campo, ocorrencias] of porCampo.entries()) {
    const valores = [...new Set(ocorrencias.map((item) => normalizarComparacao(item.valor)))];
    resultado.push({
      campo,
      ocorrencias,
      divergente: valores.length > 1,
      valor_sugerido: ocorrencias[0]?.valor ?? '',
    });
  }
  return resultado;
}

function normalizarComparacao(valor) {
  return String(valor)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function deveExigirJustificativa(vigenciaAnos) {
  return Number(vigenciaAnos) < 5;
}

if (typeof module !== 'undefined') {
  module.exports = {
    TIPO_EMPRESA,
    TIPO_ORGAO_PUBLICO,
    camposNegociais,
    criarSolicitacao,
    normalizarDadosNegociais,
    compararCamposDocumentais,
    deveExigirJustificativa,
  };
}
