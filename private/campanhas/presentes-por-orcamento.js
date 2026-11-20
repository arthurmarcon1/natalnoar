/* =====================================================================
   CAMPANHA: Presentes por orçamento (público: loja)

   Tudo o que a cliente recebe nesta campanha. Edite os textos à vontade.
   Marcadores entre colchetes ([valor], [produto], [nome da loja], [preço],
   [data], [horário]) são as partes que a cliente troca pelas dela.

   Em cada tema, o carrossel, o Reel e os Stories usam os MESMOS produtos,
   para a lojista fotografar uma vez e usar nas três peças.
   ===================================================================== */
export default {
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
