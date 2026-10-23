// converter.js
const fs = require("fs");
const Papa = require("papaparse");

const ARQUIVO_ENTRADA = "presencas.csv";
const ARQUIVO_SAIDA = "planilha_notion.csv";
const COLUNAS_DATA = ["Data"]; // nomes das colunas que têm data
const COLUNAS_TURMA = ["Sua Turma"]; // nome exato da coluna de múltipla escolha

const PLURAIS = {
  "Terça e Quinta": "Terças e Quintas",
  "Quarta e Sexta": "Quartas e Sextas",
  "Sábado": "Sábados",
};

function converterTurma(valor) {
  if (!valor) return valor;
  let resultado = valor;
  for (const [antigo, novo] of Object.entries(PLURAIS)) {
    resultado = resultado.replace(antigo, novo);
  }
  return resultado;
}
// Converte "17/10/2026, 09:30:37" para "2026-10-17T09:30:37"
function converterData(valor) {
    if (!valor) return valor;
    const m = valor
      .trim()
      .match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})(?:,?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!m) {
      console.warn("Não reconhecido:", valor);
      return valor;
    }
  
    let [, dia, mes, ano, hora, min, seg] = m;
    if (ano.length === 2) ano = "20" + ano;
    const data = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    if (!hora) return data;
    return `${data}T${hora.padStart(2, "0")}:${min}:${seg || "00"}`;
  }

const csv = fs.readFileSync(ARQUIVO_ENTRADA, "utf8");
const { data } = Papa.parse(csv, { header: true, skipEmptyLines: true });

for (const linha of data) {
  for (const coluna of COLUNAS_DATA) {
    linha[coluna] = converterData(linha[coluna]);
  }
  for (const coluna of COLUNAS_TURMA) {
      linha[coluna] = converterTurma(linha[coluna]);
}
}

// "\uFEFF" (BOM) ajuda o Notion a reconhecer UTF-8 e os acentos
fs.writeFileSync(ARQUIVO_SAIDA, "\uFEFF" + Papa.unparse(data), "utf8");
console.log(`Pronto: ${data.length} linhas convertidas em ${ARQUIVO_SAIDA}`);