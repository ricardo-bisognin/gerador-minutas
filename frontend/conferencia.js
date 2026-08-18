function montarConferencia(documentos, dadosConsolidados = {}) {
  const comparacoes = compararCamposDocumentais(documentos);
  const campos = new Map();

  for (const item of comparacoes) {
    campos.set(item.campo, {
      campo: item.campo,
      valor: dadosConsolidados[item.campo] ?? item.valor_sugerido ?? '',
      fontes: item.ocorrencias,
      status: item.divergente ? 'divergencia' : 'confirmar',
    });
  }

  return [...campos.values()];
}

function resumoConferencia(itens) {
  return {
    total: itens.length,
    divergencias: itens.filter((item) => item.status === 'divergencia').length,
    confirmacoes: itens.filter((item) => item.status === 'confirmar').length,
    pendencias: itens.filter((item) => !item.valor).length,
  };
}

function confirmarCampo(itens, campo, valor) {
  return itens.map((item) =>
    item.campo === campo
      ? { ...item, valor, status: 'confirmado' }
      : item,
  );
}

if (typeof module !== 'undefined') {
  module.exports = { montarConferencia, resumoConferencia, confirmarCampo };
}
