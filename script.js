
function iniciarMenu() {
  const botaoMenu = document.getElementById("botao-menu");
  const menu = document.getElementById("menu-principal");

  botaoMenu.addEventListener("click", function () {
    menu.classList.toggle("aberto");
    botaoMenu.classList.toggle("aberto");
  });

  // Fecha o menu automaticamente quando o usuário clica em um link (no celular)
  const linksMenu = menu.querySelectorAll("a");
  linksMenu.forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("aberto");
      botaoMenu.classList.remove("aberto");
    });
  });
}

/* ---------------------------------------------------------
   2. NAVEGAÇÃO ENTRE SEÇÕES (SITE DE PÁGINA ÚNICA)
   --------------------------------------------------------- */
function mostrarSecao(idSecao) {
  const todasSecoes = document.querySelectorAll(".secao-app");
  todasSecoes.forEach(function (secao) {
    secao.classList.add("oculto");
  });

  const secaoAlvo = document.getElementById(idSecao);
  if (secaoAlvo) {
    secaoAlvo.classList.remove("oculto");
  }

  // Atualiza o link ativo no menu
  const linksMenu = document.querySelectorAll(".menu-principal a");
  linksMenu.forEach(function (link) {
    link.classList.remove("ativo");
    if (link.getAttribute("data-secao") === idSecao) {
      link.classList.add("ativo");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function iniciarNavegacao() {
  const linksNavegacao = document.querySelectorAll("[data-secao]");
  linksNavegacao.forEach(function (link) {
    link.addEventListener("click", function (evento) {
      evento.preventDefault();
      const idSecao = link.getAttribute("data-secao");
      mostrarSecao(idSecao);
    });
  });
}

/* ---------------------------------------------------------
   3. CARDS EXPANSÍVEIS DAS ISTs ("Saiba mais")
   --------------------------------------------------------- */
function iniciarCardsIST() {
  const botoes = document.querySelectorAll(".botao-saiba-mais");

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const detalhes = botao.parentElement.querySelector(".detalhes-ist");
      const estaAberto = detalhes.classList.contains("mostrar");

      if (estaAberto) {
        detalhes.classList.remove("mostrar");
        botao.textContent = "Saiba mais +";
      } else {
        detalhes.classList.add("mostrar");
        botao.textContent = "Ver menos -";
      }
    });
  });
}

/* ---------------------------------------------------------
   4. QUIZ EDUCATIVO
   --------------------------------------------------------- */

// Banco de perguntas do quiz.
// "correta" indica o índice (começando em 0) da alternativa correta.
const perguntasQuiz = [
  {
    pergunta: "Uma pessoa com IST sempre apresenta sintomas visíveis?",
    opcoes: [
      "Sim, sempre é possível perceber pelo corpo",
      "Não, muitas ISTs podem não causar sintomas",
      "Só em homens",
      "Só em pessoas com mais de 40 anos",
    ],
    correta: 1,
    explicacao:
      "Várias ISTs, como a clamídia e até a sífilis em algumas fases, podem não apresentar sintomas visíveis. Por isso a testagem regular é tão importante.",
  },
  {
    pergunta: "Qual é a forma mais eficaz de reduzir o risco de transmissão de ISTs durante a relação sexual?",
    opcoes: [
      "Tomar banho logo depois",
      "Usar preservativo (camisinha) corretamente",
      "Confiar apenas na aparência do parceiro",
      "Evitar apenas o beijo",
    ],
    correta: 1,
    explicacao:
      "O uso correto do preservativo em todas as relações é uma das formas mais eficazes de reduzir o risco de transmissão das ISTs.",
  },
  {
    pergunta: "A vacina contra o HPV protege contra:",
    opcoes: [
      "Todas as ISTs existentes",
      "Apenas a gonorreia",
      "Alguns tipos do vírus HPV, relacionados a verrugas genitais e certos cânceres",
      "Apenas o HIV",
    ],
    correta: 2,
    explicacao:
      "A vacina contra o HPV protege contra os principais tipos do vírus associados a verrugas genitais e a alguns tipos de câncer, mas não protege contra outras ISTs.",
  },
  {
    pergunta: "O HIV pode ser transmitido por:",
    opcoes: [
      "Abraço e aperto de mão",
      "Compartilhar talheres",
      "Relação sexual sem preservativo e sangue contaminado",
      "Picada de mosquito",
    ],
    correta: 2,
    explicacao:
      "O HIV é transmitido principalmente por relação sexual sem preservativo, contato com sangue contaminado e de mãe para filho na gestação, parto ou amamentação. Não é transmitido por contato social comum.",
  },
  {
    pergunta: "A sífilis é uma IST causada por:",
    opcoes: [
      "Uma bactéria",
      "Um fungo",
      "Falta de vitamina",
      "Um vírus",
    ],
    correta: 0,
    explicacao:
      "A sífilis é causada por uma bactéria chamada Treponema pallidum e tem tratamento com antibióticos indicados por um profissional de saúde.",
  },
  {
    pergunta: "Se uma pessoa faz o teste de IST e o resultado é negativo, isso significa que:",
    opcoes: [
      "Ela nunca poderá ter uma IST",
      "Ela não precisa mais se prevenir",
      "Não há indícios da infecção no momento do teste, mas a prevenção continua importante",
      "O teste sempre é 100% desnecessário repetir",
    ],
    correta: 2,
    explicacao:
      "Um resultado negativo indica que não foram encontrados sinais da infecção naquele momento (respeitando o período de janela do exame), mas a prevenção deve continuar sendo praticada.",
  },
  {
    pergunta: "O HPV pode estar relacionado a:",
    opcoes: [
      "Apenas resfriados",
      "Verrugas genitais e, em alguns casos, ao câncer",
      "Apenas problemas de pele no rosto",
      "Nenhuma consequência à saúde",
    ],
    correta: 1,
    explicacao:
      "O HPV é uma das ISTs mais comuns e pode estar relacionado a verrugas genitais e, em alguns tipos, ao desenvolvimento de câncer, principalmente do colo do útero.",
  },
  {
    pergunta: "Qual é uma atitude importante ao suspeitar de uma IST?",
    opcoes: [
      "Esperar os sintomas passarem sozinhos",
      "Procurar um profissional ou serviço de saúde",
      "Perguntar apenas para amigos",
      "Tentar se automedicar sem orientação",
    ],
    correta: 1,
    explicacao:
      "Procurar um profissional ou serviço de saúde é a atitude correta para avaliação, diagnóstico e tratamento adequados.",
  },
];

let indiceQuizAtual = 0;
let pontuacaoQuiz = 0;

function iniciarQuiz() {
  indiceQuizAtual = 0;
  pontuacaoQuiz = 0;
  document.getElementById("quiz-resultado").classList.add("oculto");
  document.getElementById("quiz-pergunta-container").classList.remove("oculto");
  mostrarPerguntaQuiz();
}

function mostrarPerguntaQuiz() {
  const dadosPergunta = perguntasQuiz[indiceQuizAtual];

  document.getElementById("quiz-progresso").textContent =
    "Pergunta " + (indiceQuizAtual + 1) + " de " + perguntasQuiz.length;

  document.getElementById("quiz-pergunta").textContent = dadosPergunta.pergunta;

  const containerOpcoes = document.getElementById("quiz-opcoes");
  containerOpcoes.innerHTML = "";

  dadosPergunta.opcoes.forEach(function (textoOpcao, indice) {
    const botaoOpcao = document.createElement("button");
    botaoOpcao.className = "opcao-quiz";
    botaoOpcao.textContent = textoOpcao;
    botaoOpcao.addEventListener("click", function () {
      responderQuiz(indice);
    });
    containerOpcoes.appendChild(botaoOpcao);
  });

  const feedback = document.getElementById("quiz-feedback");
  feedback.classList.remove("mostrar");
  feedback.textContent = "";

  document.getElementById("botao-proxima-pergunta").classList.add("oculto");
}

function responderQuiz(indiceEscolhido) {
  const dadosPergunta = perguntasQuiz[indiceQuizAtual];
  const botoesOpcoes = document.querySelectorAll("#quiz-opcoes .opcao-quiz");

  // Desabilita todas as opções após a resposta
  botoesOpcoes.forEach(function (botao, indice) {
    botao.disabled = true;
    if (indice === dadosPergunta.correta) {
      botao.classList.add("correta");
    } else if (indice === indiceEscolhido) {
      botao.classList.add("incorreta");
    }
  });

  const acertou = indiceEscolhido === dadosPergunta.correta;
  if (acertou) {
    pontuacaoQuiz = pontuacaoQuiz + 1;
  }

  const feedback = document.getElementById("quiz-feedback");
  feedback.textContent = (acertou ? "Certinho! " : "Não foi dessa vez. ") + dadosPergunta.explicacao;
  feedback.classList.add("mostrar");

  document.getElementById("botao-proxima-pergunta").classList.remove("oculto");
}

function proximaPerguntaQuiz() {
  indiceQuizAtual = indiceQuizAtual + 1;

  if (indiceQuizAtual < perguntasQuiz.length) {
    mostrarPerguntaQuiz();
  } else {
    exibirResultadoQuiz();
  }
}

function exibirResultadoQuiz() {
  document.getElementById("quiz-pergunta-container").classList.add("oculto");
  const areaResultado = document.getElementById("quiz-resultado");
  areaResultado.classList.remove("oculto");

  document.getElementById("quiz-pontuacao-final").textContent =
    "Você acertou " + pontuacaoQuiz + " de " + perguntasQuiz.length + " perguntas!";

  let mensagem = "";
  if (pontuacaoQuiz === perguntasQuiz.length) {
    mensagem = "Mandou muito bem! Continue se informando e compartilhe esse conhecimento com outras pessoas.";
  } else if (pontuacaoQuiz >= perguntasQuiz.length / 2) {
    mensagem = "Bom resultado! Você já sabe bastante, mas vale revisar as áreas 'Conheça as ISTs' e 'Prevenção' para reforçar o conteúdo.";
  } else {
    mensagem = "Esse é só o começo! Explore as áreas 'Conheça as ISTs' e 'Prevenção' para aprender mais sobre o assunto.";
  }
  document.getElementById("quiz-mensagem-final").textContent = mensagem;
}

/* ---------------------------------------------------------
   5. MITOS E VERDADES
   --------------------------------------------------------- */
function iniciarMitosVerdades() {
  const cartoesMito = document.querySelectorAll(".cartao-mito");

  cartoesMito.forEach(function (cartao) {
    cartao.addEventListener("click", function () {
      const selo = cartao.querySelector(".selo-resposta");
      const explicacao = cartao.querySelector(".explicacao-mito");
      const dica = cartao.querySelector(".dica-clique");

      selo.classList.add("mostrar");
      explicacao.classList.add("mostrar");
      if (dica) {
        dica.classList.add("oculto");
      }
    });
  });
}

/* ---------------------------------------------------------
   6. AUTOAVALIAÇÃO EDUCATIVA DE RISCO
   --------------------------------------------------------- */

// Cada pergunta possui uma pontuação associada à resposta "Sim".
// Esses valores representam apenas uma estrutura educativa
// de apoio e NÃO configuram diagnóstico médico.
const perguntasAvaliacao = [
  {
    texto: "Você teve relação sexual sem preservativo recentemente?",
    pontosSim: 2,
  },
  {
    texto: "Você apresentou alguma ferida ou lesão na região genital?",
    pontosSim: 2,
  },
  {
    texto: "Sentiu dor ou ardência ao urinar?",
    pontosSim: 2,
  },
  {
    texto: "Percebeu alguma secreção (corrimento) diferente do habitual?",
    pontosSim: 2,
  },
  {
    texto: "Teve relação sexual com uma pessoa cujo status de IST você não conhece?",
    pontosSim: 2,
  },
  {
    texto: "Sua vacinação contra o HPV está em dia?",
    pontosSim: 0, // responder "sim" aqui é positivo
    pontosNao: 1, // responder "não" soma ponto de atenção
  },
  {
    texto: "Você já realizou algum teste para IST?",
    pontosSim: 0, // já ter testado é positivo
    pontosNao: 1,
  },
];

function criarFormularioAvaliacao() {
  const container = document.getElementById("lista-perguntas-avaliacao");
  container.innerHTML = "";

  perguntasAvaliacao.forEach(function (pergunta, indice) {
    const bloco = document.createElement("div");
    bloco.className = "pergunta-avaliacao";

    const textoPergunta = document.createElement("p");
    textoPergunta.textContent = (indice + 1) + ". " + pergunta.texto;
    bloco.appendChild(textoPergunta);

    const opcoes = document.createElement("div");
    opcoes.className = "opcoes-sim-nao";

    ["Sim", "Não"].forEach(function (rotulo) {
      const label = document.createElement("label");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "pergunta-" + indice;
      input.value = rotulo;
      input.required = true;

      label.appendChild(input);
      label.appendChild(document.createTextNode(rotulo));
      opcoes.appendChild(label);
    });

    bloco.appendChild(opcoes);
    container.appendChild(bloco);
  });
}

function calcularResultadoAvaliacao(evento) {
  evento.preventDefault();

  const formulario = evento.target;
  let pontuacaoTotal = 0;
  let todasRespondidas = true;

  perguntasAvaliacao.forEach(function (pergunta, indice) {
    const respostaSelecionada = formulario.querySelector(
      'input[name="pergunta-' + indice + '"]:checked'
    );

    if (!respostaSelecionada) {
      todasRespondidas = false;
      return;
    }

    if (respostaSelecionada.value === "Sim") {
      pontuacaoTotal += pergunta.pontosSim;
    } else {
      pontuacaoTotal += pergunta.pontosNao || 0;
    }
  });

  const mensagemErro = document.getElementById("mensagem-erro-avaliacao");

  if (!todasRespondidas) {
    mensagemErro.classList.add("mostrar");
    mensagemErro.textContent = "Por favor, responda todas as perguntas antes de continuar.";
    return;
  }

  mensagemErro.classList.remove("mostrar");
  exibirResultadoAvaliacao(pontuacaoTotal);

  // O sistema não armazena as respostas do usuário (não usamos
  // localStorage nem envio para servidor). A pontuação só existe
  // em memória enquanto a página está aberta.
}

function exibirResultadoAvaliacao(pontuacao) {
  document.getElementById("formulario-avaliacao").classList.add("oculto");
  const areaResultado = document.getElementById("resultado-avaliacao");
  areaResultado.classList.remove("oculto");

  const elementoNivel = document.getElementById("nivel-resultado-avaliacao");
  const elementoTexto = document.getElementById("texto-resultado-avaliacao");

  elementoNivel.classList.remove("nivel-baixa", "nivel-atencao", "nivel-orientacao");

  if (pontuacao <= 2) {
    elementoNivel.textContent = "Baixa atenção";
    elementoNivel.classList.add("nivel-baixa");
    elementoTexto.textContent =
      "Não foram identificados, pelas respostas fornecidas, fatores de risco relevantes. Continue mantendo medidas de prevenção e buscando informações confiáveis sobre ISTs.";
  } else if (pontuacao <= 6) {
    elementoNivel.textContent = "Atenção";
    elementoNivel.classList.add("nivel-atencao");
    elementoTexto.textContent =
      "Algumas respostas indicam situações que merecem atenção. Busque informações sobre prevenção e considere conversar com um profissional de saúde.";
  } else {
    elementoNivel.textContent = "Procure orientação";
    elementoNivel.classList.add("nivel-orientacao");
    elementoTexto.textContent =
      "As respostas indicam situações que justificam procurar um serviço de saúde para avaliação e possível testagem.";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function refazerAvaliacao() {
  document.getElementById("resultado-avaliacao").classList.add("oculto");
  document.getElementById("formulario-avaliacao").classList.remove("oculto");
  document.getElementById("formulario-avaliacao").reset();
}

/* ---------------------------------------------------------
   7. INICIALIZAÇÃO GERAL
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  iniciarMenu();
  iniciarNavegacao();
  iniciarCardsIST();
  iniciarMitosVerdades();
  criarFormularioAvaliacao();

  // Quiz
  document.getElementById("botao-iniciar-quiz").addEventListener("click", iniciarQuiz);
  document.getElementById("botao-proxima-pergunta").addEventListener("click", proximaPerguntaQuiz);
  document.getElementById("botao-refazer-quiz").addEventListener("click", iniciarQuiz);

  // Autoavaliação
 const formularioAvaliacao = document.getElementById("formulario-avaliacao");

if (formularioAvaliacao) {
    formularioAvaliacao.addEventListener("submit", calcularResultadoAvaliacao);
}

const botaoRefazer = document.getElementById("botao-refazer-avaliacao");

if (botaoRefazer) {
    botaoRefazer.addEventListener("click", refazerAvaliacao);
}

  // Mostra a seção inicial por padrão
  mostrarSecao("inicio");
});
