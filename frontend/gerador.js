// Motor V1: uma fonte de dados alimenta TC, PT, Carta e justificativa.
// A integração com os templates DOCX reais entra na próxima etapa.

export function normalizarDados(dados = {}) {
  const out = {...dados};
  out.quantidade = Number(out.quantidade) || 0;
  out.vigencia = Number(out.vigencia) || 5;
  out.horasDia = Number(out.horasDia) || 0;
  out.horasSemana = Number(out.horasSemana) || 0;
  out.dias = Array.isArray(out.dias) ? out.dias : [];
  return out;
}

export function validarGeracao(dados) {
  const d = normalizarDados(dados);
  const erros = [];
  const alertas = [];
  if (!d.estabelecimento) erros.push('Estabelecimento prisional não informado.');
  if (!d.atividade) erros.push('Atividade não informada.');
  if (!d.quantidade) erros.push('Quantidade de trabalhadores não informada.');
  if (!d.remuneracao) erros.push('Remuneração não informada.');
  if (d.vigencia < 5 && !String(d.justificativa || '').trim()) erros.push('A justificativa para vigência inferior a 5 anos é obrigatória.');
  if (d.horasDia && (d.horasDia < 6 || d.horasDia > 8)) alertas.push('A jornada diária informada está fora do intervalo de 6 a 8 horas previsto para a regra geral e deverá ser analisada no processo administrativo.');
  if (d.horasSemana > 44) alertas.push('A jornada semanal informada supera 44 horas e deverá ser analisada no processo administrativo.');
  if (d.dias.includes('domingo')) alertas.push('Foi informado trabalho aos domingos. A situação será analisada no processo administrativo, sem bloquear a geração.');
  return {ok: erros.length === 0, erros, alertas, dados: d};
}

export function montarCartaProposta(d) {
  return {
    titulo: 'CARTA PROPOSTA',
    secoes: [
      ['1. IDENTIFICAÇÃO DO PROPONENTE', [d.razao_social, d.cnpj, d.endereco, d.telefone, d.email].filter(Boolean)],
      ['2. OBJETO DA PROPOSTA', [d.atividade].filter(Boolean)],
      ['3. LOCAL DE PRESTAÇÃO', [d.local || d.outroLocal].filter(Boolean)],
      ['4. QUANTIDADE DE TRABALHADORES', [String(d.quantidade || '')].filter(Boolean)],
      ['5. REMUNERAÇÃO', [d.remuneracao].filter(Boolean)],
      ['6. JORNADA', [d.dias.join(', '), d.horasDia ? `${d.horasDia} horas diárias` : '', d.horasSemana ? `${d.horasSemana} horas semanais` : ''].filter(Boolean)],
      ['7. DECLARAÇÃO', ['O proponente declara estar ciente das condições aplicáveis à contratação de mão de obra prisional e manifesta interesse na celebração do Termo de Cooperação.']]
    ]
  };
}

export function montarJustificativa(d) {
  if (d.vigencia >= 5) return null;
  return {
    titulo: 'JUSTIFICATIVA PARA VIGÊNCIA INFERIOR A 5 (CINCO) ANOS',
    corpo: `A vigência pretendida para o Termo de Cooperação é de ${d.vigencia} ano(s). A duração inferior a 5 (cinco) anos é adotada em razão de: ${d.justificativa}.`
  };
}

export function montarDocumentos(dados) {
  const d = normalizarDados(dados);
  const validacao = validarGeracao(d);
  if (!validacao.ok) return {validacao, documentos: []};
  return {
    validacao,
    documentos: [
      {tipo:'carta_proposta', dados:montarCartaProposta(d)},
      {tipo:'termo_cooperacao', dados:d},
      {tipo:'plano_trabalho', dados:d},
      ...(montarJustificativa(d) ? [{tipo:'justificativa_vigencia', dados:montarJustificativa(d)}] : [])
    ]
  };
}
