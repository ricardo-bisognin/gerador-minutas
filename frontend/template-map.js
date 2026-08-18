// Mapeamento dos campos observados nos templates reais do projeto.
// A fonte única de dados deve alimentar estes placeholders.

export const TC_FIELDS = {
  fpe_formatado: 'fpe_formatado',
  processo_formatado: 'processo_formatado',
  fpe_rodape: 'fpe_rodape',
  ssps_representante_nome: 'ssps_representante_nome',
  ssps_representante_rg: 'ssps_representante_rg',
  ssps_representante_cpf: 'ssps_representante_cpf',
  pp_representante_nome: 'pp_representante_nome',
  pp_representante_rg: 'pp_representante_rg',
  pp_representante_cpf: 'pp_representante_cpf',
  convenente_nome_razao_social: 'convenente_nome_razao_social',
  convenente_endereco_completo: 'convenente_endereco_completo',
  convenente_cnpj: 'convenente_cnpj',
  representante_nome: 'representante_nome',
  representante_rg: 'representante_rg',
  representante_cpf: 'representante_cpf',
  atividade: 'atividade',
  quantidade: 'quantidade',
  local_prestacao: 'local_prestacao',
  jornada_texto: 'jornada_texto',
  dias_descanso: 'dias_descanso',
  remuneracao: 'remuneracao',
  vigencia_anos: 'vigencia_anos'
};

export const PT_FIELDS = {
  fpe_formatado: 'fpe_formatado',
  convenente_nome_razao_social: 'convenente_nome_razao_social',
  convenente_endereco: 'convenente_endereco',
  periodo_inicio: 'periodo_inicio',
  periodo_termino: 'periodo_termino',
  quantidade: 'quantidade',
  atividade: 'atividade',
  estabelecimentos: 'estabelecimentos',
  duracao_meses: 'duracao_meses',
  remuneracao: 'remuneracao',
  ano_assinatura: 'ano_assinatura'
};

export function formatarFpe(numero, ano) {
  if (!numero || !ano) return '';
  return `${numero}/${ano}`;
}

export function formatarProcesso(numero) {
  return numero || '';
}

export function calcularDuracaoMeses(anos) {
  const n = Number(anos) || 5;
  return Math.round(n * 12);
}

export function montarDiasDescanso(diasTrabalhados = []) {
  const todos = ['segunda','terca','quarta','quinta','sexta','sabado','domingo'];
  return todos.filter(d => !diasTrabalhados.includes(d));
}
