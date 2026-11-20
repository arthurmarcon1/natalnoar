/* =====================================================================
   CONFIGURAÇÃO DO SITE: tudo o que muda sem mexer na interface.

   precoCampanha   Preço de cada campanha (uma campanha por compra).
   comprasAbertas  false = botões mostram "Compras abrem em breve".
                   true  = o botão de compra abre o WhatsApp de vendas com a
                           mensagem pronta (ou o linkPagamento do tema, se houver).
   whatsappVendas  Número (com DDI e DDD) que recebe os pedidos de compra.
   mensagemCompra  Texto que já vem escrito; {campanha} e {preco} são trocados.
   contatoGestao   Destino do botão "Conversar sobre gestão mensal".
                   Aceita um link (https://...) ou só o número com DDI e DDD
                   (vira https://wa.me/<número>). Vazio = aviso no lugar do botão.
   publicos        "Tenho uma loja" e "Presto um serviço", cada um com seus temas.
   Tema            id, nome, publico, descricao, paraQuem (prestadores),
                   status ("disponivel" | "em-preparacao"), linkPagamento,
                   conteudo (arquivo em content/ quando a campanha está pronta).
   ===================================================================== */
export const SITE = {
  nome: "Natal no Ar",
  precoCampanha: 89.90,
  comprasAbertas: true,
  whatsappVendas: "555599408766",
  mensagemCompra: "Olá, Arthur! Quero comprar a campanha {campanha} por {preco}. Como faço o pagamento?",
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
          status: "disponivel", linkPagamento: "", conteudo: "presentes-por-orcamento" },
        { id: "looks-para-celebrar", nome: "Looks para celebrar", publico: "loja",
          descricao: "Looks para confraternização, ceia e encontros de fim de ano, montados com as peças da loja.",
          status: "em-preparacao", linkPagamento: "" },
        { id: "favoritos-da-loja", nome: "Favoritos da loja", publico: "loja",
          descricao: "As peças que mais saem e as que a equipe indica, com detalhes e histórias de cada uma.",
          status: "em-preparacao", linkPagamento: "" },
        { id: "natal-de-ultima-hora", nome: "Natal de última hora", publico: "loja",
          descricao: "Prazos reais, presentes prontos para levar e retirada na loja para quem deixou para depois.",
          status: "em-preparacao", linkPagamento: "" },
        { id: "looks-para-a-virada", nome: "Looks para a virada", publico: "loja",
          descricao: "Cores, brilhos e combinações completas para o Réveillon.",
          status: "em-preparacao", linkPagamento: "" }
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
          status: "em-preparacao", linkPagamento: "" },
        { id: "seu-toque-nas-festas", nome: "Seu toque nas festas", publico: "servico",
          descricao: "Como o seu serviço entra nas comemorações de fim de ano.",
          paraQuem: "Maquiadoras, cabeleireiras, designers de sobrancelha, manicures, confeiteiras e decoradoras.",
          status: "em-preparacao", linkPagamento: "" },
        { id: "um-tempo-para-cuidar", nome: "Um tempo para cuidar", publico: "servico",
          descricao: "O serviço como pausa e autocuidado no meio do fim de ano corrido.",
          paraQuem: "Esteticistas, massoterapeutas, manicures e terapeutas.",
          status: "em-preparacao", linkPagamento: "" },
        { id: "memorias-de-dezembro", nome: "Memórias de dezembro", publico: "servico",
          descricao: "Registros e lembranças da época, do ensaio ao presente feito à mão.",
          paraQuem: "Fotógrafas, videomakers, artesãs e quem faz lembranças personalizadas.",
          status: "em-preparacao", linkPagamento: "" },
        { id: "um-ano-de-boas-historias", nome: "Um ano de boas histórias", publico: "servico",
          descricao: "Retrospectiva com clientes, trabalhos e aprendizados do ano.",
          paraQuem: "Qualquer prestador de serviço com portfólio.",
          status: "em-preparacao", linkPagamento: "" }
      ]
    }
  ]
};
