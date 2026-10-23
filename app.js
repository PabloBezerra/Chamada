
const express = require("express");
const fs = require("fs");
const path = require("path");
const{Client} = require('@notionhq/client')
require('dotenv').config()

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const ARQUIVO = path.join(__dirname, "presencas.csv");
if (!fs.existsSync(ARQUIVO)) {
  fs.writeFileSync(ARQUIVO, "\uFEFFnome;turma;data_hora\n"); // BOM para acentos no Excel
}

app.post("/presenca", (req, res) => {

  const { turma, nome } = req.body;
  const data = new Date().toISOString();
  fs.appendFileSync(ARQUIVO, `${nome};${turma};${data}\n`);

  try{
    addStudent(nome,turma, data)
    res.json({
      sucesso: true,
      mensagem: "Presença registrada!"
    });

  }catch(erro){
    console.error(erro)
    res.json({
      sucesso: false,
      mensagem: "Algo deu errado! Constacte o professor"
    });
  }
});

const notion = new Client({auth: process.env.NOTION_API_KEY})

async function addStudent(nome, turma, day) {
  const page = await notion.pages.create({
    parent:{data_source_id: process.env.NOTION_DATA_SOURCE_ID},
    properties:{
      "Nome Completo":{title:[{text:{content: nome}}]},
      "Data":{date:{start:day}},
      "Sua Turma":{multi_select:[{name:turma}]}
    }
  })
  return page.id
}

const data = require('./src/data.json');

app.get("/data", (req, res)=>{
  res.json(data)
})

app.listen(5000, "0.0.0.0", () => console.log("Rodando na porta 5000"));