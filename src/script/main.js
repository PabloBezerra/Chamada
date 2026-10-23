
const form = document.querySelector(".form");
const name = document.querySelector(".name");
const button = document.querySelector(".button");
const radios = document.querySelectorAll('input[name="turma"]');
const main = document.querySelector("main")

const dados = await get_data()

button.disabled = true;

form.addEventListener("input", () => {
  const turmaSelecionada = document.querySelector(
    'input[name="turma"]:checked'
  );

  button.disabled = !(
    turmaSelecionada && name.value.trim() !== ""
  );
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const radioSelecionado = document.querySelector(
    'input[name="turma"]:checked'
  );

  if (!radioSelecionado || !name.value.trim()) {
    return;
  }

  const dados = {
    turma: radioSelecionado.value,
    nome: formatName(name.value)
  };

  try {
    const resposta = await fetch("/presenca", {
      method: "POST",
      body: new URLSearchParams(dados)
    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      // alert(resultado.mensagem);
      form.reset();
      button.disabled = true;
      window_alert('sucess')
    } else {
      //alert(resultado.mensagem || "Não foi possível registrar a presença.");
      window_alert('erro')
    }
  } catch (erro) {
    window_alert('erro')
    console.error("Erro ao enviar:", erro);
    // alert("Não foi possível enviar a presença.");
  }
});

function formatName(name) {
    const conectores = ["de", "da", "do", "das", "dos", "e"];
    
        return name
        .trim()
        .toLocaleLowerCase("pt-BR")
        .replace(/\s+/g, " ")
        .split(" ")
        .map((palavra, index) => {
        if (index !== 0 && conectores.includes(palavra)) {
             return palavra;
        }
    
        return palavra.charAt(0).toLocaleUpperCase("pt-BR") + palavra.slice(1);
        })
     .join(" ");
}

function window_alert (type){
  
  form.style.display = 'none'
  main.querySelector(`.${type}`).style.display = "flex"
  main.querySelector(`h1`).style.display = "none"
  main.querySelector(`p`).style.display = "none"
  
}

async function get_data() {
   const resp = await fetch("/data")
   
   if(!resp.ok){
    throw new Error("Erro ao buscar dados")
   }

   return await resp.json()
}

function contruct_options(data){
  const clases = form.querySelector('.grupo-turmas') 
  data.forEach(e => {
      e.horarios.forEach(i =>{
        const label = document.createElement('label')
        const input = document.createElement('input')
        input.type = 'radio'
        input.name = 'turma'
        input.value = `${e.dia} - ${i.replace('-', '/')}`
        label.appendChild(input)
        label.innerHTML += `${e.dia} - ${i.replace('-', '/')}`
        clases.appendChild(label)
      })
  });
}

contruct_options(dados.turmas)