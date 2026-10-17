
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const ARQUIVO = path.join(__dirname, "presencas.csv");
if (!fs.existsSync(ARQUIVO)) {
  fs.writeFileSync(ARQUIVO, "\uFEFFnome;turma;data_hora\n"); // BOM para acentos no Excel
}

app.post("/presenca", (req, res) => {
  const { turma, nome } = req.body;
  const data = new Date().toLocaleString("pt-BR");
  fs.appendFileSync(ARQUIVO, `${nome};${turma};${data}\n`);

  res.json({
    sucesso: true,
    mensagem: "Presença registrada!"
  });
});

app.listen(5000, "0.0.0.0", () => console.log("Rodando na porta 5000"));