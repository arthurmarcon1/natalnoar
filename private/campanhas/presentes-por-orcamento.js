/* =====================================================================
   CAMPANHA: Presentes por orçamento (público: loja)

   Tudo o que a cliente recebe nesta campanha. Edite os textos à vontade.
   Marcadores entre colchetes ([valor], [produto], [nome da loja], [preço],
   [data], [horário]) são as partes que a cliente troca pelas dela.

   Em cada tema, o carrossel, o Reel e os Stories usam os MESMOS produtos,
   para a lojista fotografar uma vez e usar nas três peças.
   ===================================================================== */
const campanha = {
  id: "presentes-por-orcamento",
  nome: "Presentes por orçamento",
  resumo: "Ajude a cliente a escolher presentes pelo preço, pelo estilo de quem vai ganhar e pelo prazo, e leve a conversa para o WhatsApp ou o direct.",

  temas: [
    /* ------------------------------------------------------------- 1 */
    {
      id: "faixa-de-preco",
      nome: "Presentes por faixa de preço",
      ideia: "Três presentes dentro de um valor. Quem tem um orçamento na cabeça decide mais rápido.",
      fotografar: "3 produtos que custem até o mesmo valor, cada um fotografado sozinho, de frente, com luz natural.",
      carrossel: {
        nome: "3 presentes até R$ [valor]",
        telas: [
          { titulo: "3 presentes até R$ [valor]", apoio: "Arrasta pro lado →", foto: "Os 3 produtos juntos, numa mesa ou bancada." },
          { titulo: "[produto 1]", preco: "R$ [preço]", apoio: "Para a mãe que ama sair", foto: "Produto 1 sozinho, de frente." },
          { titulo: "[produto 2]", preco: "R$ [preço]", apoio: "Para a amiga do amigo secreto", foto: "Produto 2 sozinho, de frente." },
          { titulo: "[produto 3]", preco: "R$ [preço]", apoio: "Para a irmã que ama um brilho", foto: "Produto 3 sozinho, de frente." }
        ],
        legenda: "Orçamento definido, presente resolvido 🎁\n\nSeparamos 3 presentes até R$ [valor] aqui na [nome da loja]:\n• [produto 1], para a mãe que ama sair\n• [produto 2], para a amiga do amigo secreto\n• [produto 3], para a irmã que ama um brilho\n\nQual combina com quem você vai presentear? Chama no WhatsApp ou no direct que a gente separa e embrulha pra você.\n\n#presentedenatal #[cidade] #[nome da loja]"
      },
      reel: {
        nome: "Detalhes de perto: presentes até R$ [valor]",
        duracao: "15 a 20 segundos",
        abertura: "Você segurando os 3 produtos (ou eles lado a lado na bancada). Texto na tela: \"3 presentes até R$ [valor]\".",
        cenas: [
          { filmar: "Close no [produto 1]: mostre a textura ou o fecho, abrindo e fechando.", texto: "[produto 1] · R$ [preço]" },
          { filmar: "Close no [produto 2]: mostre o caimento ou o tecido entre os dedos.", texto: "[produto 2] · R$ [preço]" },
          { filmar: "Close no [produto 3]: mostre o brilho, virando devagar para a luz.", texto: "[produto 3] · R$ [preço]" },
          { filmar: "Os 3 produtos dentro de uma sacola ou embrulho da loja.", texto: "Embrulhado pra presente" }
        ],
        legenda: "3 presentes até R$ [valor], vistos de pertinho ✨ Qual você levaria? Chama no WhatsApp que a gente separa.",
        chamadaFinal: "Texto na tela: \"Chama no WhatsApp e a gente separa\". Aponte para o botão ou para o link da bio.",
        semAparecer: "Grave só as mãos e os produtos sobre a bancada. A abertura pode ser uma tela com texto (\"3 presentes até R$ [valor]\") sobre a foto do carrossel."
      },
      stories: {
        nome: "Qual você daria de presente?",
        telas: [
          { mostrar: "Foto do [produto 1] e do [produto 2] lado a lado.", texto: "Qual você daria de presente?", recurso: "Enquete: [produto 1] / [produto 2]" },
          { mostrar: "Close do produto mais votado (ou do seu favorito).", texto: "Esse aqui sai por R$ [preço] e já vai embrulhado.", recurso: "Figurinha de contagem: \"Natal\"" },
          { mostrar: "Os 3 produtos juntos.", texto: "Quer saber se tem na sua cor ou tamanho?", recurso: "Link ou botão: \"Consultar disponibilidade\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 2 */
    {
      id: "cada-estilo",
      nome: "Um presente para cada estilo",
      ideia: "Em vez do preço, o ponto de partida é o jeito de quem vai ganhar o presente.",
      fotografar: "3 produtos bem diferentes entre si (um clássico, um divertido, um prático), cada um sozinho.",
      carrossel: {
        nome: "Um presente para cada estilo",
        telas: [
          { titulo: "Um presente para cada estilo", apoio: "Qual é o de quem você vai presentear? →", foto: "Os 3 produtos juntos, bem arrumados." },
          { titulo: "[produto 1]", preco: "R$ [preço]", apoio: "Para quem é clássica e não erra", foto: "Produto 1 sozinho." },
          { titulo: "[produto 2]", preco: "R$ [preço]", apoio: "Para quem gosta de chamar atenção", foto: "Produto 2 sozinho." },
          { titulo: "[produto 3]", preco: "R$ [preço]", apoio: "Para quem vive na correria", foto: "Produto 3 sozinho." }
        ],
        legenda: "Cada pessoa tem um estilo, e o presente certo conversa com ele 💫\n\nNa [nome da loja] tem:\n• [produto 1], para quem é clássica\n• [produto 2], para quem gosta de chamar atenção\n• [produto 3], para quem vive na correria\n\nMe conta como é a pessoa que eu te ajudo a escolher. É só chamar no WhatsApp ou no direct.\n\n#presentedenatal #[nome da loja]"
      },
      reel: {
        nome: "Qual é o estilo dela?",
        duracao: "15 a 20 segundos",
        abertura: "Você olhando para a câmera e perguntando: \"Qual é o estilo de quem você vai presentear?\". Texto na tela igual.",
        cenas: [
          { filmar: "Mãos pegando o [produto 1] na arara ou na prateleira.", texto: "Clássica: [produto 1]" },
          { filmar: "Mãos mostrando o [produto 2] na frente do corpo ou de um espelho.", texto: "Chama atenção: [produto 2]" },
          { filmar: "O [produto 3] sendo colocado dentro de uma bolsa do dia a dia.", texto: "Vive na correria: [produto 3]" },
          { filmar: "Os 3 produtos lado a lado no balcão.", texto: "E aí, qual é o dela?" }
        ],
        legenda: "Clássica, que chama atenção ou que vive na correria? Tem presente pra cada uma aqui 🎁 Comenta o estilo que eu indico.",
        chamadaFinal: "Texto na tela: \"Comenta o estilo que eu indico o presente\".",
        semAparecer: "Troque a abertura por uma tela com texto (\"Qual é o estilo dela?\") e grave só as mãos e os produtos."
      },
      stories: {
        nome: "Qual é o estilo de quem você vai presentear?",
        telas: [
          { mostrar: "Foto dos 3 produtos juntos.", texto: "Qual é o estilo de quem você vai presentear?", recurso: "Teste com 3 opções: Clássica / Chama atenção / Vive na correria" },
          { mostrar: "O produto do estilo mais votado.", texto: "Pra quem é [estilo]: [produto], R$ [preço].", recurso: "Nenhum (só a foto com texto)" },
          { mostrar: "Você ou suas mãos embrulhando o produto.", texto: "Te ajudo a escolher. Me chama!", recurso: "Caixa de perguntas: \"Como é a pessoa?\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 3 */
    {
      id: "favorito-da-loja",
      nome: "O favorito da loja",
      ideia: "Um produto só, contado em detalhes. A prova de que vale o presente é a escolha de quem conhece a loja.",
      fotografar: "Um único produto, de três jeitos: inteiro, um detalhe de perto e sendo usado ou segurado.",
      carrossel: {
        nome: "O favorito da [nome da loja]",
        telas: [
          { titulo: "O favorito da [nome da loja]", apoio: "E por que ele é um ótimo presente →", foto: "O produto inteiro, com destaque." },
          { titulo: "[produto]", preco: "R$ [preço]", apoio: "O que mais sai neste Natal", foto: "O produto inteiro, de frente." },
          { titulo: "O detalhe que encanta", preco: "R$ [preço]", apoio: "[detalhe: tecido, acabamento, fecho]", foto: "Close do detalhe." },
          { titulo: "Combina com quase todo mundo", preco: "R$ [preço]", apoio: "Por isso não tem erro", foto: "O produto sendo usado ou segurado." }
        ],
        legenda: "Se a gente tivesse que escolher um só presente, seria esse ❤️\n\n[produto] é o queridinho da [nome da loja] neste Natal: [detalhe que encanta], combina com quase todo mundo e já vai embrulhado.\n\nSai por R$ [preço]. Quer reservar o seu? Chama no WhatsApp ou no direct.\n\n#favoritodaloja #presentedenatal"
      },
      reel: {
        nome: "Por que esse é o nosso favorito",
        duracao: "15 segundos",
        abertura: "O produto entrando no quadro (alguém coloca na bancada). Texto na tela: \"O favorito da [nome da loja]\".",
        cenas: [
          { filmar: "Close lento no detalhe que encanta.", texto: "[detalhe]" },
          { filmar: "O produto sendo usado ou experimentado.", texto: "Combina com quase todo mundo" },
          { filmar: "O produto sendo embrulhado.", texto: "R$ [preço], já embrulhado" }
        ],
        legenda: "Nosso favorito deste Natal, sem dúvida ❤️ Quer o seu? Chama no WhatsApp.",
        chamadaFinal: "Texto na tela: \"Reserve o seu pelo WhatsApp\".",
        semAparecer: "Todas as cenas já funcionam só com mãos e produto. Na cena de uso, use um manequim, um cabide ou o produto sobre uma roupa dobrada."
      },
      stories: {
        nome: "Você já conhece o nosso favorito?",
        telas: [
          { mostrar: "O produto inteiro.", texto: "Você já conhece o nosso favorito?", recurso: "Enquete: Já conheço / Quero conhecer" },
          { mostrar: "Close do detalhe.", texto: "Olha esse detalhe de perto 😍", recurso: "Slider de emoji" },
          { mostrar: "O produto embrulhado.", texto: "R$ [preço]. Quer separar o seu?", recurso: "Link ou botão: \"Consultar disponibilidade\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 4 */
    {
      id: "duplas",
      nome: "Duplas que combinam",
      ideia: "Dois produtos que ficam melhores juntos. Aumenta o valor do presente sem complicar a escolha.",
      fotografar: "3 duplas de produtos (ex.: bolsa + lenço, blusa + brinco), cada dupla junta na mesma foto.",
      carrossel: {
        nome: "Duplas que combinam",
        telas: [
          { titulo: "Duplas que combinam", apoio: "Presente em dobro, escolha pela metade →", foto: "Uma das duplas, bem arrumada." },
          { titulo: "[produto A] + [produto B]", preco: "R$ [preço da dupla]", apoio: "Para a mãe", foto: "Dupla 1 junta." },
          { titulo: "[produto C] + [produto D]", preco: "R$ [preço da dupla]", apoio: "Para a sogra", foto: "Dupla 2 junta." },
          { titulo: "[produto E] + [produto F]", preco: "R$ [preço da dupla]", apoio: "Para a melhor amiga", foto: "Dupla 3 junta." }
        ],
        legenda: "Tem presente que fica ainda melhor em dupla 👯‍♀️\n\nMontamos 3 combinações na [nome da loja]:\n• [produto A] + [produto B], para a mãe\n• [produto C] + [produto D], para a sogra\n• [produto E] + [produto F], para a melhor amiga\n\nA gente embrulha junto. Quer montar a sua dupla? Chama no WhatsApp ou no direct.\n\n#presentedenatal #[nome da loja]"
      },
      reel: {
        nome: "Monte a dupla perfeita",
        duracao: "15 a 20 segundos",
        abertura: "Um produto sozinho na bancada. Texto na tela: \"Sozinho já é lindo…\".",
        cenas: [
          { filmar: "Uma mão coloca o segundo produto ao lado do primeiro.", texto: "…mas em dupla fica perfeito" },
          { filmar: "Troca rápida: a segunda dupla aparece no lugar da primeira.", texto: "[produto C] + [produto D]" },
          { filmar: "Troca rápida para a terceira dupla.", texto: "[produto E] + [produto F]" },
          { filmar: "Uma dupla sendo embrulhada junta.", texto: "A gente embrulha junto" }
        ],
        legenda: "Sozinho já é lindo, em dupla fica perfeito ✨ Qual dupla você montaria? Chama no WhatsApp.",
        chamadaFinal: "Texto na tela: \"Monte a sua dupla pelo WhatsApp\".",
        semAparecer: "O roteiro já é feito só com mãos e produtos. Para não mostrar as mãos, use cortes secos entre as duplas, com a câmera parada."
      },
      stories: {
        nome: "Monte a sua dupla",
        telas: [
          { mostrar: "Produto A sozinho.", texto: "Com o que você combinaria?", recurso: "Enquete: [produto B] / [produto C]" },
          { mostrar: "A dupla vencedora junta.", texto: "Dupla aprovada! R$ [preço da dupla].", recurso: "Nenhum" },
          { mostrar: "As 3 duplas juntas.", texto: "Quer que eu monte uma dupla pra você?", recurso: "Link ou botão: \"Falar no WhatsApp\"" }
        ]
      }
    },

    /* ------------------------------------------------------------- 5 */
    {
      id: "ultimas-compras",
      nome: "Últimas compras",
      ideia: "Prazo claro e presentes prontos para levar. Tira a ansiedade de quem deixou para a última hora.",
      fotografar: "3 produtos já embrulhados ou prontos para presente, e a fachada ou o balcão da loja.",
      carrossel: {
        nome: "Ainda dá tempo",
        telas: [
          { titulo: "Ainda dá tempo", apoio: "Os prazos de Natal da [nome da loja] →", foto: "A fachada ou o balcão da loja." },
          { titulo: "Entrega até [data]", preco: "", apoio: "Pedido pelo WhatsApp até [horário]", foto: "Uma encomenda pronta para envio." },
          { titulo: "Retirada até [data]", preco: "", apoio: "Embrulhado e pronto pra levar", foto: "Presentes embrulhados no balcão." },
          { titulo: "[produto]", preco: "R$ [preço]", apoio: "Pronto pra presente agora", foto: "Um presente pronto, em destaque." }
        ],
        legenda: "Deixou pra última hora? Respira, ainda dá tempo 🎄\n\n📦 Entrega: pedidos até [data], às [horário]\n🛍️ Retirada na loja: até [data]\n🎁 Tudo embrulhado e pronto pra presente\n\nChama no WhatsApp que a gente separa agora.\n\n#ultimahora #presentedenatal #[cidade]"
      },
      reel: {
        nome: "Corre que ainda dá tempo",
        duracao: "10 a 15 segundos",
        abertura: "Um relógio, o celular com a data ou um calendário na tela. Texto: \"Ainda dá tempo!\".",
        cenas: [
          { filmar: "Presentes embrulhados enfileirados no balcão.", texto: "Prontos pra levar" },
          { filmar: "Mãos fechando uma sacola e entregando.", texto: "Retirada até [data]" },
          { filmar: "Uma encomenda saindo para entrega (porta, moto, caixa).", texto: "Entrega até [data]" }
        ],
        legenda: "Ainda dá tempo! Entrega até [data] e retirada até [data] ⏰ Chama no WhatsApp.",
        chamadaFinal: "Texto na tela: \"Chama agora no WhatsApp\".",
        semAparecer: "Grave só os presentes, as sacolas e as mãos. A abertura pode ser uma tela com texto em fundo de cor."
      },
      stories: {
        nome: "Faltam [X] dias para o Natal",
        telas: [
          { mostrar: "Presentes embrulhados.", texto: "Faltam [X] dias para o Natal 🎄", recurso: "Figurinha de contagem regressiva: \"Natal\"" },
          { mostrar: "O balcão ou a fachada.", texto: "Entrega até [data] · retirada até [data].", recurso: "Nenhum" },
          { mostrar: "Um presente pronto em destaque.", texto: "Ainda tem? Pergunta agora!", recurso: "Link ou botão: \"Consultar disponibilidade\"" }
        ]
      }
    }
  ],

  whatsapp: [
    { titulo: "Resposta a quem pergunta o preço", quando: "Quando alguém pergunta \"quanto custa?\" no WhatsApp ou no direct.",
      texto: "Oi, [nome]! Tudo bem? 😊 O [produto] sai por R$ [preço] e já vai embrulhado pra presente. Temos nas cores [cores]. Quer que eu separe um pra você? Dá pra retirar aqui na [nome da loja] ou receber em casa." },
    { titulo: "Sugestão de presente", quando: "Para clientes que já compraram com você. Envie individualmente.",
      texto: "Oi, [nome]! Aqui é a [seu nome], da [nome da loja] 🎁 Separei umas ideias de presente até R$ [valor] e lembrei de você. Quer que eu te mande as fotos? É só responder aqui." },
    { titulo: "Aviso de prazo", quando: "Nos últimos dias antes do Natal.",
      texto: "Oi, [nome]! Passando pra avisar: pedidos para entrega até [data] e retirada na loja até [data] 🎄 Se ainda falta algum presente, me chama que eu separo e embrulho pra você." }
  ],

  calendario: {
    dez: [
      { dia: 1, pecas: ["Carrossel: 3 presentes até R$ [valor]", "Stories: Qual você daria de presente?"] },
      { dia: 2, pecas: ["Reel: Detalhes de perto: presentes até R$ [valor]"] },
      { dia: 3, pecas: ["Carrossel: Um presente para cada estilo", "Stories: Qual é o estilo de quem você vai presentear?"] },
      { dia: 4, pecas: ["Reel: Qual é o estilo dela?", "WhatsApp: Sugestão de presente"] },
      { dia: 5, pecas: ["Carrossel: O favorito da [nome da loja]", "Stories: Você já conhece o nosso favorito?"] },
      { dia: 6, pecas: ["Reel: Por que esse é o nosso favorito"] },
      { dia: 7, pecas: ["Carrossel: Duplas que combinam", "Stories: Monte a sua dupla"] },
      { dia: 8, pecas: ["Reel: Monte a dupla perfeita"] },
      { dia: 9, pecas: ["Carrossel: Ainda dá tempo", "Stories: Faltam [X] dias para o Natal", "WhatsApp: Aviso de prazo"] },
      { dia: 10, pecas: ["Reel: Corre que ainda dá tempo"] }
    ],
    expressa: [
      { dia: 1, pecas: ["Carrossel: 3 presentes até R$ [valor]", "Stories: Qual você daria de presente?"] },
      { dia: 2, pecas: ["Reel: Detalhes de perto: presentes até R$ [valor]", "WhatsApp: Sugestão de presente"] },
      { dia: 3, pecas: ["Carrossel: Ainda dá tempo", "Stories: Faltam [X] dias para o Natal", "WhatsApp: Aviso de prazo"] }
    ],
    dica: "Publique o feed entre 11h e 13h ou entre 18h e 20h. Stories podem sair ao longo do dia. A mensagem de \"resposta a quem pergunta o preço\" vale para qualquer dia."
  },

  tutorial: [
    { titulo: "Fotografe com luz de janela", texto: "Produto no centro, fundo liso, celular na vertical. Evite flash. Uma foto por tela do carrossel." },
    { titulo: "Troque os marcadores", texto: "Tudo o que está entre colchetes, como [produto], [preço] e [nome da loja], é para trocar pelo que é seu. O resto pode ficar como está." },
    { titulo: "Monte as telas", texto: "No editor, toque em cada tela, escolha a foto e ajuste o enquadramento arrastando a imagem. O texto fica legível em qualquer foto." },
    { titulo: "Baixe na ordem", texto: "As imagens saem numeradas (01 a 04) no tamanho do Instagram, 1080 × 1350. No iPhone, use \"Compartilhar\" e salve as imagens." },
    { titulo: "Publique e cole a legenda", texto: "No Instagram, selecione as 4 imagens na ordem, cole a legenda (botão Copiar legenda) e publique no dia indicado no calendário." },
    { titulo: "Grave os Reels pelo roteiro", texto: "Cada roteiro tem as cenas e o texto na tela. Se não quiser aparecer, siga a alternativa: só mãos, produto ou tela com texto." }
  ],

  /* Telas do editor "Experimentar uma publicação" (tema 1).
     antes   = como a peça chega: foto genérica e marcadores.
     exemplo = a mesma peça editada (fotos em assets/exemplo/). */
  editor: {
    tema: "faixa-de-preco",
    antes: {
      marca: "[nome da loja]",
      telas: [
        { tipo: "capa", texto: "3 presentes até", preco: "R$ [valor]", apoio: "Arrasta pro lado →" },
        { tipo: "produto", texto: "[produto]", preco: "R$ [preço]", apoio: "Para a mãe que ama sair" },
        { tipo: "produto", texto: "[produto]", preco: "R$ [preço]", apoio: "Para a amiga do amigo secreto" },
        { tipo: "produto", texto: "[produto]", preco: "R$ [preço]", apoio: "Para a irmã que ama um brilho" }
      ]
    },
    exemplo: {
      marca: "Ateliê Aurora",
      telas: [
        { tipo: "capa", texto: "3 presentes até", preco: "R$ 100", apoio: "Arrasta pro lado →", foto: "assets/exemplo/01-presentes.jpg" },
        { tipo: "produto", texto: "Clutch Noite", preco: "R$ 89", apoio: "Para a mãe que ama sair", foto: "assets/exemplo/02-clutch.jpg" },
        { tipo: "produto", texto: "Lenço de seda", preco: "R$ 59", apoio: "Para a amiga do amigo secreto", foto: "assets/exemplo/03-lenco.jpg" },
        { tipo: "produto", texto: "Brincos dourados", preco: "R$ 79", apoio: "Para a irmã que ama um brilho", foto: "assets/exemplo/04-brincos.jpg" }
      ]
    },
    legenda: "Orçamento definido, presente resolvido 🎁\n\nSeparamos 3 presentes até [valor] aqui na [nome da loja]:\n• [tela 2]\n• [tela 3]\n• [tela 4]\n\nQual combina com quem você vai presentear? Chama no WhatsApp ou no direct que a gente separa e embrulha pra você.\n\n#presentedenatal"
  }
};

/* =====================================================================
   PLANO NATAL COMPLETO: 3 temas extras (cada um: 1 carrossel + 1 roteiro)
   ===================================================================== */
campanha.extras = [
  {
    id: "amigo-secreto",
    nome: "Achados para o amigo secreto",
    ideia: "Presentes certeiros para quem você mal conhece. Resolve o sorteio da firma e da família.",
    fotografar: "3 produtos de valor parecido, cada um sozinho, com um laço ou etiqueta de presente.",
    carrossel: {
      nome: "Amigo secreto sem erro",
      telas: [
        { titulo: "Amigo secreto sem erro", apoio: "Achados até R$ [valor] →", foto: "Os 3 produtos juntos, com laço." },
        { titulo: "[produto 1]", preco: "R$ [preço]", apoio: "Para quem você mal conhece", foto: "Produto 1 sozinho." },
        { titulo: "[produto 2]", preco: "R$ [preço]", apoio: "Para a colega de trabalho", foto: "Produto 2 sozinho." },
        { titulo: "[produto 3]", preco: "R$ [preço]", apoio: "Para quem já tem tudo", foto: "Produto 3 sozinho." }
      ],
      legenda: "Tirou alguém que você mal conhece no amigo secreto? 🎁\n\nNa [nome da loja] tem achado até R$ [valor] que agrada qualquer pessoa:\n• [produto 1], para quem você mal conhece\n• [produto 2], para a colega de trabalho\n• [produto 3], para quem já tem tudo\n\nChama no WhatsApp ou no direct que a gente embrulha.\n\n#amigosecreto #presentedenatal"
    },
    reel: {
      nome: "Tirei quem eu nem conheço",
      duracao: "10 a 15 segundos",
      abertura: "Você abrindo o papelzinho do sorteio, com cara de dúvida. Texto na tela: \"Tirei quem eu nem conheço…\".",
      cenas: [
        { filmar: "Mãos pegando o [produto 1] na prateleira.", texto: "Até R$ [valor]: [produto 1]" },
        { filmar: "O [produto 2] sendo colocado na sacola.", texto: "Agrada qualquer pessoa" },
        { filmar: "O [produto 3] sendo embrulhado com laço.", texto: "Já sai embrulhado" }
      ],
      legenda: "Amigo secreto resolvido em 10 segundos 🎁 Qual desses você daria?",
      chamadaFinal: "Texto na tela: \"Chama no WhatsApp e a gente separa\".",
      semAparecer: "Troque a abertura por uma tela com o texto sobre a foto dos 3 produtos e grave só as mãos."
    }
  },
  {
    id: "tres-jeitos",
    nome: "Uma peça, três jeitos de usar",
    ideia: "A mesma peça em três ocasiões. Mostra que ela vale o investimento e vira presente fácil.",
    fotografar: "Uma peça combinada de 3 jeitos (no corpo, num manequim ou montada sobre a cama).",
    carrossel: {
      nome: "Uma peça, três jeitos",
      telas: [
        { titulo: "Uma peça, três jeitos", apoio: "Do trabalho à ceia →", foto: "A peça sozinha, bem iluminada." },
        { titulo: "No trabalho", preco: "R$ [preço]", apoio: "[peça] + [combinação 1]", foto: "Combinação 1." },
        { titulo: "No fim de semana", preco: "R$ [preço]", apoio: "[peça] + [combinação 2]", foto: "Combinação 2." },
        { titulo: "Na ceia de Natal", preco: "R$ [preço]", apoio: "[peça] + [combinação 3]", foto: "Combinação 3." }
      ],
      legenda: "Uma peça só, três ocasiões ✨\n\nO [peça] da [nome da loja] vai do trabalho à ceia de Natal. Arrasta pra ver as combinações e me conta qual é a sua.\n\nSai por R$ [preço]. Chama no WhatsApp pra ver tamanhos e cores.\n\n#comousar #lookdenatal"
    },
    reel: {
      nome: "Três looks com uma peça",
      duracao: "15 segundos",
      abertura: "A peça no cabide, de frente. Texto na tela: \"Uma peça, três jeitos\".",
      cenas: [
        { filmar: "Corte seco para a combinação de trabalho.", texto: "No trabalho" },
        { filmar: "Corte seco para a combinação de fim de semana.", texto: "No fim de semana" },
        { filmar: "Corte seco para a combinação de festa.", texto: "Na ceia de Natal" }
      ],
      legenda: "Qual dos três jeitos é a sua cara? Comenta 1, 2 ou 3 👇",
      chamadaFinal: "Texto na tela: \"Comenta 1, 2 ou 3\".",
      semAparecer: "Use um manequim ou monte as combinações sobre a cama, filmando de cima."
    }
  },
  {
    id: "escolhas-da-equipe",
    nome: "Escolhas da equipe",
    ideia: "Quem atende a cliente todo dia indica o presente. Dá rosto e confiança à loja.",
    fotografar: "Cada pessoa da equipe (ou só as mãos dela) segurando o produto que escolheu.",
    carrossel: {
      nome: "Escolhas da equipe",
      telas: [
        { titulo: "Escolhas da equipe", apoio: "O que a gente daria de presente →", foto: "A equipe reunida, ou o balcão da loja." },
        { titulo: "[nome 1] escolheu", preco: "R$ [preço]", apoio: "[produto] · porque [motivo]", foto: "Pessoa 1 com o produto." },
        { titulo: "[nome 2] escolheu", preco: "R$ [preço]", apoio: "[produto] · porque [motivo]", foto: "Pessoa 2 com o produto." },
        { titulo: "[nome 3] escolheu", preco: "R$ [preço]", apoio: "[produto] · porque [motivo]", foto: "Pessoa 3 com o produto." }
      ],
      legenda: "Pedimos para a equipe da [nome da loja] escolher um presente 💝\n\nCada uma explicou o porquê. Arrasta e descobre qual você levaria.\n\nChama no WhatsApp ou no direct que a gente separa.\n\n#escolhasdaequipe #presentedenatal"
    },
    reel: {
      nome: "O presente que eu daria",
      duracao: "15 a 20 segundos",
      abertura: "Alguém da equipe olhando para a câmera: \"Se eu fosse dar um presente, seria esse\".",
      cenas: [
        { filmar: "A pessoa 1 mostrando o produto e dizendo o motivo em uma frase.", texto: "[nome 1]: [produto]" },
        { filmar: "A pessoa 2 fazendo o mesmo.", texto: "[nome 2]: [produto]" },
        { filmar: "A pessoa 3 fazendo o mesmo.", texto: "[nome 3]: [produto]" }
      ],
      legenda: "A equipe escolheu, agora é sua vez 🎁 Qual você levaria?",
      chamadaFinal: "Texto na tela: \"Qual você levaria? Chama no WhatsApp\".",
      semAparecer: "Cada pessoa aparece só com as mãos segurando o produto; o nome e o motivo vão no texto na tela."
    }
  }
];

/* =====================================================================
   PLANO NATAL + VIRADA: minicampanha de Réveillon
   (3 carrosséis, 3 roteiros, 3 sequências de Stories, calendário de 5 dias)
   ===================================================================== */
campanha.reveillon = {
  nome: "Virada na [nome da loja]",
  temas: [
    {
      id: "cores-da-virada",
      nome: "Cores da virada",
      ideia: "Cada cor com um desejo para o ano novo. A cliente escolhe a peça pela intenção.",
      fotografar: "3 peças em cores diferentes (branco, dourado, rosa ou vermelho), cada uma sozinha.",
      carrossel: {
        nome: "Qual cor vai te acompanhar?",
        telas: [
          { titulo: "Qual cor vai te acompanhar?", apoio: "Cores da virada →", foto: "As 3 peças juntas." },
          { titulo: "Branco: paz", preco: "R$ [preço]", apoio: "[peça branca]", foto: "Peça branca." },
          { titulo: "Dourado: prosperidade", preco: "R$ [preço]", apoio: "[peça dourada]", foto: "Peça dourada." },
          { titulo: "Rosa: amor", preco: "R$ [preço]", apoio: "[peça rosa ou vermelha]", foto: "Peça rosa ou vermelha." }
        ],
        legenda: "Qual cor vai te acompanhar no ano novo? ✨\n\n🤍 Branco: paz\n💛 Dourado: prosperidade\n💗 Rosa: amor\n\nNa [nome da loja] tem peça de cada cor. Chama no WhatsApp e escolhe a sua.\n\n#reveillon #corsdavirada"
      },
      reel: {
        nome: "A cor da sua virada",
        duracao: "15 segundos",
        abertura: "As 3 peças lado a lado. Texto na tela: \"Qual cor vai te acompanhar?\".",
        cenas: [
          { filmar: "Close na peça branca, mexendo no tecido.", texto: "Branco: paz" },
          { filmar: "Close na peça dourada, refletindo a luz.", texto: "Dourado: prosperidade" },
          { filmar: "Close na peça rosa ou vermelha.", texto: "Rosa: amor" }
        ],
        legenda: "Paz, prosperidade ou amor? Comenta a sua cor 👇",
        chamadaFinal: "Texto na tela: \"Comenta a sua cor\".",
        semAparecer: "Todas as cenas são só de peças; filme com o celular parado e cortes secos."
      },
      stories: {
        nome: "Qual é a sua cor da virada?",
        telas: [
          { mostrar: "As 3 peças juntas.", texto: "Qual é a sua cor da virada?", recurso: "Teste: Branco / Dourado / Rosa" },
          { mostrar: "A peça da cor mais votada.", texto: "Essa sai por R$ [preço].", recurso: "Nenhum" },
          { mostrar: "As 3 peças embrulhadas.", texto: "Quer garantir a sua?", recurso: "Link ou botão: \"Consultar disponibilidade\"" }
        ]
      }
    },
    {
      id: "looks-da-virada",
      nome: "Looks para a virada",
      ideia: "Um look para cada jeito de passar o Réveillon: praia, casa ou festa.",
      fotografar: "3 looks completos, no corpo, no manequim ou montados sobre a cama.",
      carrossel: {
        nome: "3 looks para a virada",
        telas: [
          { titulo: "3 looks para a virada", apoio: "Onde você vai passar? →", foto: "Os 3 looks juntos." },
          { titulo: "Na praia", preco: "R$ [preço]", apoio: "[peças do look 1]", foto: "Look 1." },
          { titulo: "Em casa com a família", preco: "R$ [preço]", apoio: "[peças do look 2]", foto: "Look 2." },
          { titulo: "Na festa", preco: "R$ [preço]", apoio: "[peças do look 3]", foto: "Look 3." }
        ],
        legenda: "Praia, casa ou festa: onde vai ser a sua virada? 🥂\n\nMontamos um look para cada uma aqui na [nome da loja]. Arrasta e me conta qual é o seu.\n\nChama no WhatsApp pra ver tamanhos.\n\n#lookdavirada #reveillon"
      },
      reel: {
        nome: "Onde vai ser a sua virada?",
        duracao: "15 segundos",
        abertura: "Texto na tela: \"Onde vai ser a sua virada?\" sobre a foto dos 3 looks.",
        cenas: [
          { filmar: "Look da praia, mostrando o caimento.", texto: "Na praia" },
          { filmar: "Look de casa, mostrando o conforto.", texto: "Em casa com a família" },
          { filmar: "Look de festa, mostrando o brilho.", texto: "Na festa" }
        ],
        legenda: "Praia, casa ou festa? Tem look pra todas aqui 🥂",
        chamadaFinal: "Texto na tela: \"Escolha o seu pelo WhatsApp\".",
        semAparecer: "Use manequim ou monte os looks sobre a cama, filmando de cima."
      },
      stories: {
        nome: "Onde você vai passar a virada?",
        telas: [
          { mostrar: "Os 3 looks juntos.", texto: "Onde você vai passar a virada?", recurso: "Enquete: Praia / Casa / Festa" },
          { mostrar: "O look mais votado.", texto: "Esse look sai por R$ [preço].", recurso: "Nenhum" },
          { mostrar: "O look dobrado ou na sacola.", texto: "Quer ver no seu tamanho?", recurso: "Link ou botão: \"Consultar disponibilidade\"" }
        ]
      }
    },
    {
      id: "ultimos-dias-do-ano",
      nome: "Últimos dias do ano",
      ideia: "Prazos claros de entrega e retirada para quem deixou o look da virada para o fim.",
      fotografar: "Peças prontas para levar e o balcão ou a fachada da loja.",
      carrossel: {
        nome: "Ainda dá tempo para a virada",
        telas: [
          { titulo: "Ainda dá tempo para a virada", apoio: "Os prazos da [nome da loja] →", foto: "A fachada ou o balcão." },
          { titulo: "Entrega até [data]", preco: "", apoio: "Pedido pelo WhatsApp até [horário]", foto: "Uma encomenda pronta." },
          { titulo: "Retirada até [data]", preco: "", apoio: "Separado e pronto para levar", foto: "Peças separadas no balcão." },
          { titulo: "[peça]", preco: "R$ [preço]", apoio: "Pronta para usar na virada", foto: "Uma peça em destaque." }
        ],
        legenda: "Ainda dá tempo de garantir o look da virada 🥂\n\n📦 Entrega: pedidos até [data], às [horário]\n🛍️ Retirada: até [data]\n\nChama no WhatsApp que a gente separa agora.\n\n#reveillon #ultimahora"
      },
      reel: {
        nome: "Corre que ainda dá tempo",
        duracao: "10 segundos",
        abertura: "O celular mostrando a data. Texto na tela: \"Ainda dá tempo!\".",
        cenas: [
          { filmar: "Peças separadas no balcão.", texto: "Separadas para você" },
          { filmar: "Mãos fechando uma sacola.", texto: "Retirada até [data]" },
          { filmar: "Uma encomenda saindo para entrega.", texto: "Entrega até [data]" }
        ],
        legenda: "Ainda dá tempo para o look da virada ⏰ Chama no WhatsApp.",
        chamadaFinal: "Texto na tela: \"Chama agora no WhatsApp\".",
        semAparecer: "Grave só as peças, as sacolas e as mãos."
      },
      stories: {
        nome: "Faltam [X] dias para a virada",
        telas: [
          { mostrar: "Peças separadas.", texto: "Faltam [X] dias para a virada 🥂", recurso: "Figurinha de contagem regressiva: \"Ano novo\"" },
          { mostrar: "O balcão ou a fachada.", texto: "Entrega até [data] · retirada até [data].", recurso: "Nenhum" },
          { mostrar: "Uma peça em destaque.", texto: "Ainda tem? Pergunta agora!", recurso: "Link ou botão: \"Consultar disponibilidade\"" }
        ]
      }
    }
  ]
};

/* ---------- calendários dos planos maiores (citam cada peça pelo nome) ---------- */
const C = t => `Carrossel: ${t.carrossel.nome}`, R = t => `Reel: ${t.reel.nome}`, S = t => `Stories: ${t.stories.nome}`;
const [t1, t2, t3, t4, t5] = campanha.temas, [x1, x2, x3] = campanha.extras, [v1, v2, v3] = campanha.reveillon.temas;
const W = i => `WhatsApp: ${campanha.whatsapp[i].titulo}`;
campanha.calendario.quinze = [
  [C(t1), S(t1)], [R(t1)], [C(x1)], [C(t2), S(t2)], [R(t2), W(1)], [R(x1)], [C(t3), S(t3)], [R(t3)],
  [C(x2)], [R(x2)], [C(t4), S(t4)], [R(t4)], [C(x3), R(x3)], [C(t5), S(t5), W(2)], [R(t5)]
].map((pecas, i) => ({ dia: i + 1, pecas }));
campanha.reveillon.calendario = [
  [C(v1), S(v1)], [R(v1)], [C(v2), S(v2)], [R(v2), C(v3)], [R(v3), S(v3)]
].map((pecas, i) => ({ dia: i + 1, pecas }));

export default campanha;
