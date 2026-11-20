/* =====================================================================
   CAMPANHA: Seu toque nas festas (público: prestadoras de serviço)

   Para maquiadoras, cabeleireiras, designers de sobrancelha, manicures,
   confeiteiras e decoradoras. Os exemplos usam uma maquiadora; os marcadores
   ([serviço], [preço], [nome do negócio]…) adaptam para qualquer serviço.
   Em cada tema, carrossel, Reel e Stories usam as MESMAS fotos de trabalhos.
   ===================================================================== */
const campanha = {
  id: "seu-toque-nas-festas",
  nome: "Seu toque nas festas",
  resumo: "Mostre como o seu serviço entra nas comemorações de fim de ano, com trabalhos reais, bastidores e chamadas para o WhatsApp.",

  temas: [
    /* ------------------------------------------------------------- 1 */
    {
      id: "estilo-para-cada-festa",
      nome: "Um estilo para cada festa",
      ideia: "Três versões do seu serviço, cada uma pensada para uma comemoração. A cliente se enxerga numa delas.",
      fotografar: "3 trabalhos diferentes (fotos de clientes com autorização ou de um modelo), cada um sozinho, com luz natural.",
      carrossel: {
        nome: "3 estilos para as festas",
        telas: [
          { titulo: "3 estilos para as festas", apoio: "Qual é o seu? →", foto: "Uma foto bonita de trabalho, de perto." },
          { titulo: "[serviço 1]", preco: "R$ [preço]", apoio: "Para o almoço da firma", foto: "Trabalho 1." },
          { titulo: "[serviço 2]", preco: "R$ [preço]", apoio: "Para o jantar de Natal", foto: "Trabalho 2." },
          { titulo: "[serviço 3]", preco: "R$ [preço]", apoio: "Para a confraternização", foto: "Trabalho 3." }
        ],
        legenda: "Cada festa pede um toque diferente ✨\n\nSeparei 3 estilos para o fim de ano:\n• [serviço 1], para o almoço da firma\n• [serviço 2], para o jantar de Natal\n• [serviço 3], para a confraternização\n\nQual combina com a sua festa? Me chama no WhatsApp ou no direct.\n\n#[serviço]defesta #[cidade]"
      },
      reel: {
        nome: "Qual combina com a sua festa?",
        duracao: "15 a 20 segundos",
        abertura: "Você olhando para a câmera: \"Qual estilo combina com a sua festa?\". Texto na tela igual.",
        cenas: [
          { filmar: "Close no trabalho 1 pronto, virando devagar para a luz.", texto: "[serviço 1] · almoço da firma" },
          { filmar: "Close no trabalho 2 pronto.", texto: "[serviço 2] · jantar de Natal" },
          { filmar: "Close no trabalho 3 pronto.", texto: "[serviço 3] · confraternização" },
          { filmar: "Suas mãos organizando o material de trabalho.", texto: "Qual é o seu?" }
        ],
        legenda: "Almoço, jantar ou confraternização? Tem um estilo para cada uma ✨ Comenta o seu.",
        chamadaFinal: "Texto na tela: \"Me chama no WhatsApp\".",
        semAparecer: "Troque a abertura por uma tela com texto sobre a foto do trabalho 1 e grave só os resultados e as mãos."
      },
      stories: {
        nome: "Qual combina com a sua festa?",
        telas: [
          { mostrar: "Fotos dos 3 trabalhos.", texto: "Qual combina com a sua festa?", recurso: "Enquete: [serviço 1] / [serviço 2] / [serviço 3]" },
          { mostrar: "O trabalho mais votado, de perto.", texto: "Esse sai por R$ [preço].", recurso: "Nenhum" },
          { mostrar: "Seu material de trabalho organizado.", texto: "Quer esse para a sua festa?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 2 */
    {
      id: "vale-presente",
      nome: "Vale-presente de Natal",
      ideia: "O seu serviço como presente. Quem quer agradar a mãe, a amiga ou a sogra compra de você.",
      fotografar: "Um cartão ou envelope de vale-presente (pode ser impresso em casa) e 2 trabalhos seus.",
      carrossel: {
        nome: "Presente que vira cuidado",
        telas: [
          { titulo: "Presente que vira cuidado", apoio: "Vale-presente de Natal →", foto: "O cartão do vale-presente com laço." },
          { titulo: "Vale [serviço 1]", preco: "R$ [preço]", apoio: "Para a mãe que nunca para", foto: "Trabalho 1." },
          { titulo: "Vale [serviço 2]", preco: "R$ [preço]", apoio: "Para a amiga que merece", foto: "Trabalho 2." },
          { titulo: "Monte o seu", preco: "a partir de R$ [preço]", apoio: "Você escolhe o valor", foto: "O cartão nas mãos." }
        ],
        legenda: "Neste Natal, dê cuidado de presente 🎁\n\nO vale-presente da [nome do negócio] vale para [serviço 1], [serviço 2] ou o valor que você escolher. Chega num cartão bonito, pronto para entregar.\n\nMe chama no WhatsApp ou no direct.\n\n#valepresente #presentedenatal"
      },
      reel: {
        nome: "O presente que ela vai lembrar",
        duracao: "15 segundos",
        abertura: "O cartão do vale-presente entrando no envelope. Texto na tela: \"O presente que ela vai lembrar\".",
        cenas: [
          { filmar: "Você escrevendo o nome no cartão.", texto: "Vale [serviço]" },
          { filmar: "Um trabalho seu pronto, de perto.", texto: "Ela escolhe o dia" },
          { filmar: "O envelope sendo fechado com laço.", texto: "A partir de R$ [preço]" }
        ],
        legenda: "Presente que vira cuidado 🎁 Vale-presente pelo WhatsApp.",
        chamadaFinal: "Texto na tela: \"Peça o seu pelo WhatsApp\".",
        semAparecer: "Todas as cenas funcionam só com mãos, cartão e trabalhos."
      },
      stories: {
        nome: "Pra quem você daria?",
        telas: [
          { mostrar: "O cartão do vale-presente.", texto: "Pra quem você daria um vale-presente?", recurso: "Enquete: Mãe / Amiga / Sogra" },
          { mostrar: "Um trabalho seu.", texto: "Vale a partir de R$ [preço].", recurso: "Nenhum" },
          { mostrar: "O cartão nas mãos.", texto: "Quer o seu?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 3 */
    {
      id: "antes-e-depois",
      nome: "Antes e depois",
      ideia: "A transformação conta o valor do trabalho melhor que qualquer explicação.",
      fotografar: "Uma cliente (com autorização) antes, durante e depois, sempre com a mesma luz e o mesmo ângulo.",
      carrossel: {
        nome: "Antes e depois de uma produção de festa",
        telas: [
          { titulo: "Antes e depois de uma produção de festa", apoio: "Arrasta pro lado →", foto: "O resultado final, de perto." },
          { titulo: "Antes", preco: "", apoio: "[como chegou]", foto: "Antes." },
          { titulo: "Durante", preco: "", apoio: "[o que eu fiz]", foto: "Durante." },
          { titulo: "Depois", preco: "R$ [preço]", apoio: "[serviço] · [tempo]", foto: "Depois." }
        ],
        legenda: "Do antes ao depois em [tempo] ✨\n\nA [nome da cliente] chegou com [como chegou] e saiu pronta para a festa. Fiz [o que eu fiz].\n\n[serviço] por R$ [preço]. Me chama no WhatsApp ou no direct.\n\n#antesedepois #[serviço]"
      },
      reel: {
        nome: "Do antes ao depois",
        duracao: "10 a 15 segundos",
        abertura: "O antes, parado por 1 segundo. Texto na tela: \"Antes…\".",
        cenas: [
          { filmar: "Cenas rápidas do processo, em velocidade acelerada.", texto: "[o que eu fiz]" },
          { filmar: "Corte seco para o resultado.", texto: "…e depois ✨" },
          { filmar: "O resultado virando devagar para a luz.", texto: "[serviço] · R$ [preço]" }
        ],
        legenda: "Do antes ao depois em [tempo] ✨ Quer o seu?",
        chamadaFinal: "Texto na tela: \"Me chama no WhatsApp\".",
        semAparecer: "Você não precisa aparecer: grave só a cliente (com autorização) e as suas mãos trabalhando."
      },
      stories: {
        nome: "Antes ou depois?",
        telas: [
          { mostrar: "O antes.", texto: "Adivinha como ficou 👀", recurso: "Slider de emoji" },
          { mostrar: "O depois.", texto: "Ficou assim! [serviço] por R$ [preço].", recurso: "Enquete: Amei / Quero também" },
          { mostrar: "Antes e depois lado a lado.", texto: "Quer o seu?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 4 */
    {
      id: "por-dentro-do-atendimento",
      nome: "Por dentro do atendimento",
      ideia: "Mostrar como é ser atendida por você tira o medo de quem nunca veio e valoriza cada etapa.",
      fotografar: "O seu espaço arrumado, o material separado e um detalhe de cada etapa.",
      carrossel: {
        nome: "Como é um atendimento comigo",
        telas: [
          { titulo: "Como é um atendimento comigo", apoio: "Do café ao resultado →", foto: "O seu espaço arrumado." },
          { titulo: "A conversa", preco: "", apoio: "Entendo a festa, a roupa e o seu jeito", foto: "Referências ou o café servido." },
          { titulo: "O preparo", preco: "", apoio: "[primeira etapa do serviço]", foto: "Material separado ou a etapa." },
          { titulo: "O resultado", preco: "R$ [preço]", apoio: "[serviço] · [duração]", foto: "O resultado final." }
        ],
        legenda: "Já pensou como é um atendimento comigo? ☕\n\nComeça com uma conversa sobre a sua festa, passa pelo preparo com calma e termina com você se olhando no espelho.\n\n[serviço] por R$ [preço], em [duração]. Me chama no WhatsApp ou no direct.\n\n#bastidores #[serviço]"
      },
      reel: {
        nome: "Um atendimento em 15 segundos",
        duracao: "15 segundos",
        abertura: "A porta do seu espaço abrindo. Texto na tela: \"Vem comigo num atendimento\".",
        cenas: [
          { filmar: "O café sendo servido ou as referências na mesa.", texto: "Primeiro, a conversa" },
          { filmar: "Suas mãos fazendo a primeira etapa.", texto: "Depois, o preparo" },
          { filmar: "O resultado no espelho.", texto: "E o resultado ✨" }
        ],
        legenda: "Um atendimento inteiro em 15 segundos ☕✨",
        chamadaFinal: "Texto na tela: \"Vem viver isso também\".",
        semAparecer: "Grave o espaço, o material e as suas mãos; o rosto da cliente só com autorização."
      },
      stories: {
        nome: "Bastidores de hoje",
        telas: [
          { mostrar: "O seu espaço pela manhã.", texto: "Bastidores de hoje ☕", recurso: "Caixa de perguntas: \"O que você quer saber?\"" },
          { mostrar: "O material separado para o atendimento.", texto: "Tudo pronto para a cliente das [horário].", recurso: "Nenhum" },
          { mostrar: "O resultado do dia.", texto: "Ficou assim! Quer o seu?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 5 */
    {
      id: "o-que-minhas-clientes-dizem",
      nome: "O que minhas clientes dizem",
      ideia: "A palavra de quem já foi atendida convence quem ainda está em dúvida.",
      fotografar: "Prints de mensagens de clientes (com autorização e sem dados pessoais) e fotos dos trabalhos delas.",
      carrossel: {
        nome: "O que minhas clientes dizem",
        telas: [
          { titulo: "O que minhas clientes dizem", apoio: "Arrasta e lê →", foto: "Um trabalho seu bonito." },
          { titulo: "“[depoimento 1]”", preco: "", apoio: "[nome da cliente 1] · [serviço]", foto: "Trabalho da cliente 1." },
          { titulo: "“[depoimento 2]”", preco: "", apoio: "[nome da cliente 2] · [serviço]", foto: "Trabalho da cliente 2." },
          { titulo: "“[depoimento 3]”", preco: "", apoio: "[nome da cliente 3] · [serviço]", foto: "Trabalho da cliente 3." }
        ],
        legenda: "Nada me deixa mais feliz do que mensagens assim 💛\n\nObrigada a cada cliente que confiou no meu trabalho este ano. Quer ser a próxima? Me chama no WhatsApp ou no direct.\n\n#depoimentos #[serviço]"
      },
      reel: {
        nome: "Mensagens que eu guardo",
        duracao: "10 a 15 segundos",
        abertura: "Você rolando o celular com as mensagens. Texto na tela: \"Mensagens que eu guardo\".",
        cenas: [
          { filmar: "Print do depoimento 1 com o trabalho atrás.", texto: "“[trecho do depoimento 1]”" },
          { filmar: "Print do depoimento 2 com o trabalho atrás.", texto: "“[trecho do depoimento 2]”" },
          { filmar: "Print do depoimento 3 com o trabalho atrás.", texto: "“[trecho do depoimento 3]”" }
        ],
        legenda: "Cada mensagem dessas vale o ano inteiro 💛",
        chamadaFinal: "Texto na tela: \"Quer ser a próxima? Me chama\".",
        semAparecer: "Use só os prints e as fotos dos trabalhos, com transições simples."
      },
      stories: {
        nome: "Recebi essa mensagem",
        telas: [
          { mostrar: "Print de um depoimento (sem dados pessoais).", texto: "Recebi essa mensagem hoje 🥹", recurso: "Slider de emoji" },
          { mostrar: "O trabalho dessa cliente.", texto: "E foi esse o resultado.", recurso: "Nenhum" },
          { mostrar: "Seu espaço ou material.", texto: "Quer o seu?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    }
  ],

  whatsapp: [
    { titulo: "Resposta a quem pergunta o preço", quando: "Quando alguém pergunta \"quanto custa?\".",
      texto: "Oi, [nome]! Tudo bem? 😊 O [serviço] sai por R$ [preço] e leva cerca de [duração]. Para festas de fim de ano, tenho [dias disponíveis]. Quer que eu reserve um horário para você?" },
    { titulo: "Sugestão de vale-presente", quando: "Para clientes que já foram atendidas. Envie individualmente.",
      texto: "Oi, [nome]! Aqui é a [seu nome], da [nome do negócio] 🎁 Este ano estou com vale-presente de Natal: dá para presentear a mãe, uma amiga ou quem você quiser com [serviço]. Quer que eu te mande os valores?" },
    { titulo: "Aviso de últimas datas", quando: "Nos últimos dias antes do Natal.",
      texto: "Oi, [nome]! Passando para avisar: restam poucas datas antes do Natal ([datas]) 🎄 Se você tem festa chegando, me chama que eu vejo o melhor horário para você." }
  ],

  calendario: {
    dica: "Publique o feed entre 11h e 13h ou entre 18h e 20h. Stories podem sair ao longo do dia. A resposta a quem pergunta o preço vale para qualquer dia."
  },

  tutorial: [
    { titulo: "Fotografe com luz de janela", texto: "Trabalho no centro, fundo limpo, celular na vertical. Peça autorização à cliente antes de usar o rosto dela." },
    { titulo: "Troque os marcadores", texto: "Tudo o que está entre colchetes, como [serviço], [preço] e [nome do negócio], é para trocar pelo que é seu." },
    { titulo: "Monte as telas", texto: "No editor, toque em cada tela, escolha a foto e ajuste o enquadramento. O texto fica legível em qualquer foto." },
    { titulo: "Baixe na ordem", texto: "As imagens saem numeradas (01 a 04) no tamanho do Instagram, 1080 × 1350. No iPhone, use \"Compartilhar\" e salve as imagens." },
    { titulo: "Publique e cole a legenda", texto: "Selecione as imagens na ordem, cole a legenda (botão Copiar legenda) e publique no dia indicado no calendário." },
    { titulo: "Grave os Reels pelo roteiro", texto: "Cada roteiro tem as cenas e o texto na tela. Se não quiser aparecer, siga a alternativa: só mãos, trabalho ou tela com texto." }
  ],

  editor: {
    tema: "estilo-para-cada-festa",
    exemplo: {
      marca: "Bia Make",
      telas: [
        { tipo: "capa", texto: "3 estilos para", preco: "as festas", apoio: "Qual é o seu? →", foto: "assets/exemplo/05-servico-capa.jpg" },
        { tipo: "produto", texto: "Make leve", preco: "R$ 120", apoio: "Para o almoço da firma", foto: "assets/exemplo/06-make-leve.jpg" },
        { tipo: "produto", texto: "Glow dourado", preco: "R$ 160", apoio: "Para o jantar de Natal", foto: "assets/exemplo/07-glow.jpg" },
        { tipo: "produto", texto: "Penteado de festa", preco: "R$ 140", apoio: "Para a confraternização", foto: "assets/exemplo/08-penteado.jpg" }
      ]
    },
    legenda: "Cada festa pede um toque diferente ✨\n\nSeparei 3 estilos para o fim de ano aqui na [nome da loja]:\n• [tela 2]\n• [tela 3]\n• [tela 4]\n\nQual combina com a sua festa? Me chama no WhatsApp ou no direct."
  }
};

/* =====================================================================
   PLANO NATAL COMPLETO: 3 temas extras (cada um: 1 carrossel + 1 roteiro)
   ===================================================================== */
campanha.extras = [
  {
    id: "duvida-que-sempre-me-fazem",
    nome: "Uma dúvida que sempre me fazem",
    ideia: "Responder a pergunta mais comum mostra conhecimento e tira a última barreira antes da compra.",
    fotografar: "Você (ou suas mãos) com o material de trabalho e 2 trabalhos que ilustram a resposta.",
    carrossel: {
      nome: "A dúvida que eu mais ouço",
      telas: [
        { titulo: "A dúvida que eu mais ouço", apoio: "“[pergunta frequente]” →", foto: "Você ou seu material." },
        { titulo: "A resposta curta", preco: "", apoio: "[resposta em uma frase]", foto: "Trabalho que ilustra a resposta." },
        { titulo: "Por que isso importa", preco: "", apoio: "[explicação simples]", foto: "Detalhe do trabalho." },
        { titulo: "No seu caso", preco: "R$ [preço]", apoio: "[serviço indicado] · me chama", foto: "Resultado final." }
      ],
      legenda: "Toda semana alguém me pergunta: \"[pergunta frequente]\" 🤔\n\nA resposta curta: [resposta em uma frase]. Arrasta que eu explico.\n\nFicou alguma dúvida? Me chama no WhatsApp ou no direct.\n\n#duvidas #[serviço]"
    },
    reel: {
      nome: "Respondendo a dúvida número 1",
      duracao: "15 a 20 segundos",
      abertura: "Você lendo a pergunta no celular. Texto na tela: \"“[pergunta frequente]”\".",
      cenas: [
        { filmar: "Você olhando para a câmera e dando a resposta curta.", texto: "[resposta em uma frase]" },
        { filmar: "Close no trabalho que ilustra a resposta.", texto: "Olha a diferença" },
        { filmar: "O resultado final.", texto: "Ficou com dúvida? Me chama" }
      ],
      legenda: "A dúvida que eu mais ouço, respondida em 15 segundos 💬",
      chamadaFinal: "Texto na tela: \"Manda sua dúvida no direct\".",
      semAparecer: "Escreva a pergunta e a resposta como texto na tela, sobre vídeos das suas mãos e dos trabalhos."
    }
  },
  {
    id: "como-escolho-cada-detalhe",
    nome: "Como escolho cada detalhe",
    ideia: "As escolhas por trás do resultado mostram que o seu trabalho é pensado, não sorte.",
    fotografar: "Um trabalho pronto e os materiais usados nele, organizados sobre a bancada.",
    carrossel: {
      nome: "Por que escolhi cada detalhe",
      telas: [
        { titulo: "Por que escolhi cada detalhe", apoio: "Nada aqui é por acaso →", foto: "O trabalho pronto." },
        { titulo: "[escolha 1]", preco: "", apoio: "Porque [motivo 1]", foto: "Detalhe 1 ou material 1." },
        { titulo: "[escolha 2]", preco: "", apoio: "Porque [motivo 2]", foto: "Detalhe 2 ou material 2." },
        { titulo: "[escolha 3]", preco: "R$ [preço]", apoio: "Porque [motivo 3]", foto: "Detalhe 3 ou material 3." }
      ],
      legenda: "Resultado bonito não é sorte: é escolha ✨\n\nNeste trabalho, escolhi [escolha 1] porque [motivo 1], [escolha 2] porque [motivo 2] e [escolha 3] porque [motivo 3].\n\nQuer um trabalho pensado para você? Me chama no WhatsApp ou no direct.\n\n#bastidores #[serviço]"
    },
    reel: {
      nome: "Nada aqui é por acaso",
      duracao: "15 segundos",
      abertura: "O trabalho pronto. Texto na tela: \"Nada aqui é por acaso\".",
      cenas: [
        { filmar: "Suas mãos pegando o material 1.", texto: "[escolha 1]: [motivo 1]" },
        { filmar: "Suas mãos pegando o material 2.", texto: "[escolha 2]: [motivo 2]" },
        { filmar: "Suas mãos pegando o material 3.", texto: "[escolha 3]: [motivo 3]" }
      ],
      legenda: "Cada detalhe tem um porquê ✨ Qual você não sabia?",
      chamadaFinal: "Texto na tela: \"Quer o seu? Me chama\".",
      semAparecer: "O roteiro já é feito só com mãos, materiais e o trabalho pronto."
    }
  },
  {
    id: "historia-por-tras-de-um-trabalho",
    nome: "A história por trás de um trabalho",
    ideia: "Uma história real cria conexão e mostra o cuidado com cada cliente.",
    fotografar: "Um trabalho marcante do ano (com autorização da cliente) e um detalhe que conte a história.",
    carrossel: {
      nome: "A história por trás deste trabalho",
      telas: [
        { titulo: "A história por trás deste trabalho", apoio: "Arrasta pro lado →", foto: "O trabalho pronto." },
        { titulo: "O pedido", preco: "", apoio: "[o que a cliente queria]", foto: "Referência ou o antes." },
        { titulo: "O desafio", preco: "", apoio: "[o que tornou especial]", foto: "Um detalhe do processo." },
        { titulo: "O resultado", preco: "", apoio: "[como ela reagiu]", foto: "O resultado e a cliente." }
      ],
      legenda: "Esse trabalho tem história 💛\n\nA [nome da cliente] me pediu [o que a cliente queria]. O desafio foi [o que tornou especial]. Quando ela viu o resultado, [como ela reagiu].\n\nTem uma história para eu fazer parte? Me chama no WhatsApp ou no direct.\n\n#historiasreais #[serviço]"
    },
    reel: {
      nome: "Esse trabalho tem história",
      duracao: "20 segundos",
      abertura: "O resultado final, em silêncio. Texto na tela: \"Esse trabalho tem história\".",
      cenas: [
        { filmar: "A referência ou o antes.", texto: "Ela queria [o que a cliente queria]" },
        { filmar: "Um momento do processo.", texto: "O desafio: [o que tornou especial]" },
        { filmar: "A reação da cliente (com autorização) ou o resultado.", texto: "E ela [como ela reagiu] 🥹" }
      ],
      legenda: "Tem trabalho que vira lembrança 💛",
      chamadaFinal: "Texto na tela: \"Qual é a sua história?\".",
      semAparecer: "Conte a história só em texto na tela, sobre fotos e vídeos do trabalho."
    }
  }
];

/* =====================================================================
   PLANO NATAL + VIRADA: minicampanha de Réveillon
   ===================================================================== */
campanha.reveillon = {
  nome: "Virada com [nome do negócio]",
  temas: [
    {
      id: "producao-para-a-virada",
      nome: "Produção para a virada",
      ideia: "Três propostas para o Réveillon, do discreto ao brilho total.",
      fotografar: "3 trabalhos com clima de festa (brilho, branco, dourado), cada um sozinho.",
      carrossel: {
        nome: "3 produções para a virada",
        telas: [
          { titulo: "3 produções para a virada", apoio: "Do discreto ao brilho total →", foto: "Um trabalho com brilho, de perto." },
          { titulo: "[serviço 1]", preco: "R$ [preço]", apoio: "Para virar na praia", foto: "Trabalho 1." },
          { titulo: "[serviço 2]", preco: "R$ [preço]", apoio: "Para a ceia em família", foto: "Trabalho 2." },
          { titulo: "[serviço 3]", preco: "R$ [preço]", apoio: "Para a festa da virada", foto: "Trabalho 3." }
        ],
        legenda: "Como você quer começar o ano novo? 🥂\n\n• [serviço 1], para virar na praia\n• [serviço 2], para a ceia em família\n• [serviço 3], para a festa da virada\n\nAs datas de fim de ano são poucas. Me chama no WhatsApp ou no direct.\n\n#reveillon #[serviço]"
      },
      reel: {
        nome: "Escolha a sua produção da virada",
        duracao: "15 segundos",
        abertura: "Brilho ou confete na frente da câmera. Texto na tela: \"Produção para a virada\".",
        cenas: [
          { filmar: "Close no trabalho 1.", texto: "Praia: [serviço 1]" },
          { filmar: "Close no trabalho 2.", texto: "Família: [serviço 2]" },
          { filmar: "Close no trabalho 3, com bastante brilho.", texto: "Festa: [serviço 3]" }
        ],
        legenda: "Praia, família ou festa? Escolha a sua produção da virada 🥂",
        chamadaFinal: "Texto na tela: \"Me chama no WhatsApp\".",
        semAparecer: "Grave só os trabalhos e as suas mãos, com cortes secos."
      },
      stories: {
        nome: "Como vai ser a sua virada?",
        telas: [
          { mostrar: "Os 3 trabalhos juntos.", texto: "Como vai ser a sua virada?", recurso: "Enquete: Praia / Família / Festa" },
          { mostrar: "O trabalho mais votado.", texto: "Esse sai por R$ [preço].", recurso: "Nenhum" },
          { mostrar: "Seu material com brilho.", texto: "Quer esse para a virada?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    },
    {
      id: "ritual-de-fim-de-ano",
      nome: "Ritual de fim de ano",
      ideia: "Um momento de cuidado antes do ano novo, para fechar o ano bem consigo mesma.",
      fotografar: "Seu espaço com clima acolhedor (luz baixa, vela, café) e um trabalho tranquilo.",
      carrossel: {
        nome: "Feche o ano cuidando de você",
        telas: [
          { titulo: "Feche o ano cuidando de você", apoio: "Um ritual antes da virada →", foto: "Seu espaço acolhedor." },
          { titulo: "Desacelere", preco: "", apoio: "[momento 1 do atendimento]", foto: "Detalhe tranquilo." },
          { titulo: "Se cuide", preco: "", apoio: "[momento 2 do atendimento]", foto: "Suas mãos trabalhando." },
          { titulo: "Comece o ano renovada", preco: "R$ [preço]", apoio: "[serviço] · [duração]", foto: "O resultado." }
        ],
        legenda: "Antes de pensar no ano novo, pense em você 🤍\n\nPreparei um [serviço] especial para fechar o ano: [momento 1], [momento 2] e você saindo renovada.\n\nR$ [preço], em [duração]. Me chama no WhatsApp ou no direct.\n\n#autocuidado #reveillon"
      },
      reel: {
        nome: "Um respiro antes da virada",
        duracao: "15 segundos",
        abertura: "Uma vela sendo acesa no seu espaço. Texto na tela: \"Um respiro antes da virada\".",
        cenas: [
          { filmar: "Detalhes tranquilos do atendimento.", texto: "Desacelere" },
          { filmar: "Suas mãos trabalhando com calma.", texto: "Se cuide" },
          { filmar: "O resultado, com luz suave.", texto: "Comece o ano renovada" }
        ],
        legenda: "Um respiro antes do ano novo 🤍 Vem viver esse ritual.",
        chamadaFinal: "Texto na tela: \"Me chama no WhatsApp\".",
        semAparecer: "O roteiro já é feito com detalhes, mãos e o espaço."
      },
      stories: {
        nome: "Como você quer fechar o ano?",
        telas: [
          { mostrar: "Seu espaço acolhedor.", texto: "Como você quer fechar o ano?", recurso: "Enquete: Correndo / Me cuidando" },
          { mostrar: "Um detalhe do atendimento.", texto: "Preparei um ritual de fim de ano: R$ [preço].", recurso: "Nenhum" },
          { mostrar: "O resultado.", texto: "Quer o seu?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    },
    {
      id: "obrigada-por-este-ano",
      nome: "Obrigada por este ano",
      ideia: "Agradecer às clientes fecha o ano com carinho e lembra quem ainda não voltou.",
      fotografar: "Fotos de trabalhos do ano e uma foto sua (ou do espaço) para o agradecimento.",
      carrossel: {
        nome: "Obrigada por este ano",
        telas: [
          { titulo: "Obrigada por este ano", apoio: "Uma retrospectiva com vocês →", foto: "Você ou seu espaço." },
          { titulo: "[número] clientes", preco: "", apoio: "atendidas com carinho", foto: "Um trabalho do ano." },
          { titulo: "[momento marcante]", preco: "", apoio: "[por que foi especial]", foto: "O trabalho desse momento." },
          { titulo: "Que venha [ano]", preco: "", apoio: "[novidade ou desejo para o ano]", foto: "Seu espaço ou material." }
        ],
        legenda: "Obrigada por este ano 🤍\n\nForam [número] clientes, muitas histórias e [momento marcante]. Cada uma de vocês fez parte disso.\n\nQue venha [ano], com [novidade ou desejo]. Feliz ano novo!\n\n#retrospectiva #gratidao"
      },
      reel: {
        nome: "Meu ano em 15 segundos",
        duracao: "15 segundos",
        abertura: "Texto na tela: \"Meu ano em 15 segundos\" sobre uma foto sua.",
        cenas: [
          { filmar: "Sequência rápida de fotos de trabalhos do ano.", texto: "[número] clientes" },
          { filmar: "O trabalho do momento marcante.", texto: "[momento marcante]" },
          { filmar: "Você acenando ou seu espaço arrumado.", texto: "Obrigada! Que venha [ano] 🥂" }
        ],
        legenda: "Meu ano em 15 segundos. Obrigada por cada atendimento 🤍",
        chamadaFinal: "Texto na tela: \"Nos vemos em [ano]\".",
        semAparecer: "Use só as fotos dos trabalhos e termine com uma tela de texto."
      },
      stories: {
        nome: "Obrigada por este ano",
        telas: [
          { mostrar: "Uma foto sua ou do espaço.", texto: "Obrigada por este ano 🤍", recurso: "Nenhum" },
          { mostrar: "Um trabalho marcante.", texto: "Qual foi o seu momento favorito comigo?", recurso: "Caixa de perguntas" },
          { mostrar: "Seu material arrumado.", texto: "Já quer garantir o primeiro horário de [ano]?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    }
  ]
};

/* ---------- calendários (citam cada peça pelo nome) ---------- */
const C = t => `Carrossel: ${t.carrossel.nome}`, R = t => `Reel: ${t.reel.nome}`, S = t => `Stories: ${t.stories.nome}`;
const W = i => `WhatsApp: ${campanha.whatsapp[i].titulo}`;
const [t1, t2, t3, t4, t5] = campanha.temas, [x1, x2, x3] = campanha.extras, [v1, v2, v3] = campanha.reveillon.temas;
const dias = lista => lista.map((pecas, i) => ({ dia: i + 1, pecas }));
campanha.calendario.dez = dias([[C(t1), S(t1)], [R(t1)], [C(t2), S(t2)], [R(t2), W(1)], [C(t3), S(t3)], [R(t3)], [C(t4), S(t4)], [R(t4)], [C(t5), S(t5), W(2)], [R(t5)]]);
campanha.calendario.expressa = dias([[C(t1), S(t1)], [R(t1), W(1)], [C(t2), S(t2), W(2)]]);
campanha.calendario.quinze = dias([[C(t1), S(t1)], [R(t1)], [C(x1)], [C(t2), S(t2)], [R(t2), W(1)], [R(x1)], [C(t3), S(t3)], [R(t3)], [C(x2)], [R(x2)], [C(t4), S(t4)], [R(t4)], [C(x3), R(x3)], [C(t5), S(t5), W(2)], [R(t5)]]);
campanha.reveillon.calendario = dias([[C(v1), S(v1)], [R(v1)], [C(v2), S(v2)], [R(v2), C(v3)], [R(v3), S(v3)]]);

export default campanha;
