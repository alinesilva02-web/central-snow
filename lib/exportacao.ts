function escaparCsv(valor: string | number | null | undefined) {
  const texto = String(valor ?? "");
  const textoSeguro = /^[\s]*[=+\-@]/.test(texto) ? `'${texto}` : texto;

  return `"${textoSeguro.replace(/"/g, '""')}"`;
}

export function exportarCsv(
  nomeArquivo: string,
  cabecalhos: string[],
  linhas: Array<Array<string | number | null | undefined>>
) {
  const conteudo = [cabecalhos, ...linhas]
    .map((linha) => linha.map(escaparCsv).join(","))
    .join("\r\n");
  const arquivo = new Blob(["\uFEFF", conteudo], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
