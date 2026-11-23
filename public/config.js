/* =====================================================================
   CONFIGURAÇÃO DO SITE: tudo o que muda sem mexer na interface.

   planos          Três planos de compra única. "preco" é o valor FINAL do plano
                   (o Completo custa 139,90, não 89,90 + extras). "nivel" diz o que
                   o plano libera na área da cliente: 1 = Natal (5 temas),
                   2 = + 3 temas extras e calendário de 15 dias, 3 = + Réveillon.
   precoCampanha   Menor preço (usado em "A partir de").
   modoCompra      "revisao"  (testes): "Comprar campanha" abre a revisão do pedido
                              no próprio site. Nada é cobrado nem aprovado ali; de lá a
                              pessoa pode seguir para o checkout.
                   "checkout" (lançamento): "Comprar campanha" leva direto ao checkout.
                   Checkout = linksPagamento[plano] do tema; se vazio, o WhatsApp de vendas
                   com a mensagem pronta.
   whatsappVendas  Número (com DDI e DDD) que recebe os pedidos de compra.
   mensagemCompra  Texto que já vem escrito; {campanha}, {plano} e {preco} são trocados.
   contatoGestao   Destino do botão "Conversar sobre gestão mensal".
                   Aceita um link (https://...) ou só o número com DDI e DDD
                   (vira https://wa.me/<número>). Vazio = aviso no lugar do botão.
   publicos        "Tenho uma loja" e "Presto um serviço", cada um com seus temas.
   Tema            id, nome, publico, descricao, paraQuem (prestadores),
                   status ("disponivel" | "em-preparacao"),
                   linksPagamento: { "<id do plano>": "https://..." } (vazio = WhatsApp),
                   conteudo (arquivo em content/ quando a campanha está pronta).
   ===================================================================== */
export const SITE = {
  nome: "Natal no Ar",
  precoCampanha: 89.90,
  /* Cartões dos planos: "qtd" vai em destaque; "itens" logo abaixo; "destaque" é a frase de venda.
     "incluemTodos" aparece uma vez, abaixo dos cartões. */
  incluemTodos: "Todos os planos incluem legendas, 3 mensagens de WhatsApp, calendário e tutorial.",
  planos: [
    { id: "natal-pronto", nome: "Natal Pronto", preco: 89.90, nivel: 1,
      carrosseis: 5, roteiros: 5, stories: 5, mensagens: 3, calendario: "10 dias",
      qtd: "5 carrosséis editáveis + 5 roteiros de Reels",
      itens: ["5 sequências de Stories (15 telas)", "Calendário de 10 dias"],
      destaque: "",
      resumo: "A campanha de Natal completa para você postar.",
      acrescenta: ["5 carrosséis editáveis com legendas", "5 roteiros de Reels", "5 sequências de Stories", "3 mensagens de WhatsApp", "Calendário de 10 dias", "Tutorial"] },
    { id: "natal-completo", nome: "Natal Completo", preco: 139.90, nivel: 2,
      carrosseis: 8, roteiros: 8, stories: 5, mensagens: 3, calendario: "15 dias",
      qtd: "8 carrosséis + 8 roteiros de Reels",
      itens: ["5 sequências de Stories (15 telas)", "Calendário de 15 dias"],
      destaque: "Por R$ 50 a mais, leve 3 novos temas, cada um com carrossel e roteiro de Reel.",
      resumo: "Tudo do Natal Pronto, com mais três temas.",
      acrescenta: ["+ 3 carrosséis sobre temas novos", "+ 3 roteiros de Reels", "Calendário ampliado para 15 dias"] },
    { id: "natal-virada", nome: "Natal + Virada", preco: 189.90, nivel: 3,
      carrosseis: 11, roteiros: 11, stories: 8, mensagens: 3, calendario: "15 dias + 5 de Réveillon",
      qtd: "11 carrosséis + 11 roteiros de Reels",
      itens: ["8 sequências de Stories (24 telas)", "Calendário de 15 dias de Natal + 5 de Réveillon"],
      destaque: "Por mais R$ 50 em relação ao Completo, seu conteúdo de Réveillon também vem pronto.",
      resumo: "Tudo do Natal Completo, mais uma minicampanha de Réveillon.",
      acrescenta: ["+ Minicampanha de Réveillon", "+ 3 carrosséis e 3 roteiros de Reels", "+ 3 sequências de Stories", "Calendário próprio de 5 dias"] }
  ],

  modoCompra: "revisao",
  whatsappVendas: "555599408766",
  mensagemCompra: "Olá, Arthur! Quero comprar a campanha {campanha} no plano {plano}, por {preco}. Como faço o pagamento?",
  contatoGestao: "555599408766",
  mensagemGestao: "Olá, Arthur! Vi o Natal no Ar e quero conversar sobre gestão mensal de conteúdo.",

  publicos: [
    {
      id: "loja",
      nome: "Tenho uma loja",
      chamada: "Para lojas de roupas, calçados, acessórios e presentes.",
      temas: [
        { id: "presentes-por-orcamento", nome: "Presentes por orçamento", publico: "loja",
          descricao: "Presentes organizados por preço, estilo e prazo, para a cliente decidir rápido e chamar a loja.",
          status: "disponivel", linksPagamento: {}, conteudo: "presentes-por-orcamento",
          extras: ["Achados para o amigo secreto", "Uma peça, três jeitos de usar", "Escolhas da equipe"],
          reveillon: ["Cores da virada", "Looks para a virada", "Últimos dias do ano"] },
        { id: "looks-para-celebrar", nome: "Looks para celebrar", publico: "loja",
          descricao: "Looks para confraternização, ceia e encontros de fim de ano, montados com as peças da loja.",
          status: "em-preparacao", linksPagamento: {} },
        { id: "favoritos-da-loja", nome: "Favoritos da loja", publico: "loja",
          descricao: "As peças que mais saem e as que a equipe indica, com detalhes e histórias de cada uma.",
          status: "em-preparacao", linksPagamento: {} },
        { id: "natal-de-ultima-hora", nome: "Natal de última hora", publico: "loja",
          descricao: "Prazos reais, presentes prontos para levar e retirada na loja para quem deixou para depois.",
          status: "em-preparacao", linksPagamento: {} },
        { id: "looks-para-a-virada", nome: "Looks para a virada", publico: "loja",
          descricao: "Cores, brilhos e combinações completas para o Réveillon.",
          status: "em-preparacao", linksPagamento: {} }
      ]
    },
    {
      id: "servico",
      nome: "Presto um serviço",
      chamada: "Para quem vive do próprio trabalho: beleza, fotografia, bem-estar, festas e feitos à mão.",
      temas: [
        { id: "por-tras-do-resultado", nome: "Por trás do resultado", publico: "servico",
          descricao: "Bastidores, escolhas do profissional e trabalhos reais, para mostrar o valor do que você faz.",
          paraQuem: "A fotógrafa conta a história de um ensaio; a maquiadora mostra como escolheu os tons; a cabeleireira mostra o antes e depois de um penteado de festa.",
          status: "em-preparacao", linksPagamento: {} },
        { id: "seu-toque-nas-festas", nome: "Seu toque nas festas", publico: "servico",
          descricao: "Como o seu serviço entra nas comemorações de fim de ano: estilos, vale-presente, antes e depois e bastidores.",
          paraQuem: "Maquiadoras, cabeleireiras, designers de sobrancelha, manicures, confeiteiras e decoradoras.",
          status: "disponivel", linksPagamento: {}, conteudo: "seu-toque-nas-festas",
          extras: ["Uma dúvida que sempre me fazem", "Como escolho cada detalhe", "A história por trás de um trabalho"],
          reveillon: ["Produção para a virada", "Ritual de fim de ano", "Obrigada por este ano"] },
        { id: "um-tempo-para-cuidar", nome: "Um tempo para cuidar", publico: "servico",
          descricao: "O serviço como pausa e autocuidado no meio do fim de ano corrido.",
          paraQuem: "Esteticistas, massoterapeutas, manicures e terapeutas.",
          status: "em-preparacao", linksPagamento: {} },
        { id: "memorias-de-dezembro", nome: "Memórias de dezembro", publico: "servico",
          descricao: "Registros e lembranças da época, do ensaio ao presente feito à mão.",
          paraQuem: "Fotógrafas, videomakers, artesãs e quem faz lembranças personalizadas.",
          status: "em-preparacao", linksPagamento: {} },
        { id: "um-ano-de-boas-historias", nome: "Um ano de boas histórias", publico: "servico",
          descricao: "Retrospectiva com clientes, trabalhos e aprendizados do ano.",
          paraQuem: "Qualquer prestador de serviço com portfólio.",
          status: "em-preparacao", linksPagamento: {} }
      ]
    }
  ]
};
