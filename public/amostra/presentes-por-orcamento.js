/* =====================================================================
   DEMONSTRAÇÃO PÚBLICA: Presentes por orçamento

   Só o que aparece para quem ainda não comprou: 3 produtos de exemplo,
   as telas de amostra e TRECHOS de legenda, roteiro e calendário.
   O conteúdo completo fica em private/campanhas/ e só sai pela área da cliente.

   Para trocar as fotos provisórias pelas suas: substitua os arquivos em
   public/assets/exemplo/ mantendo os nomes (ou mude o campo "foto" abaixo).
   Fotos na vertical (4:5) funcionam melhor.
   ===================================================================== */
export default {
  marca: "Ateliê Aurora",
  faixa: "R$ 100",
  capaFoto: "assets/exemplo/01-presentes.jpg",
  produtos: [
    { id: "clutch", nome: "Clutch Noite", preco: "R$ 89", paraQuem: "Para a mãe que ama sair",
      detalhe: "O fecho dourado faz barulhinho de presente caro.", foto: "assets/exemplo/02-clutch.jpg" },
    { id: "lenco", nome: "Lenço de seda", preco: "R$ 59", paraQuem: "Para a amiga do amigo secreto",
      detalhe: "Cai bem no pescoço, no cabelo ou na alça da bolsa.", foto: "assets/exemplo/03-lenco.jpg" },
    { id: "brincos", nome: "Brincos dourados", preco: "R$ 79", paraQuem: "Para a irmã que ama um brilho",
      detalhe: "Leves para usar a noite toda, com brilho de festa.", foto: "assets/exemplo/04-brincos.jpg" }
  ],

  /* Prévia do roteiro do Reel (cenas resumidas). {produto} e {preco} viram o produto escolhido. */
  reel: [
    { foto: "capa", texto: "3 presentes até R$ 100", gravar: "Abertura: você segurando os 3 produtos, ou eles lado a lado na bancada." },
    { foto: "produto", texto: "{produto} · {preco}", gravar: "Close no produto: mostre a textura, o fecho ou o caimento." },
    { foto: "produto", texto: "{paraQuem}", gravar: "Vire o produto devagar para a luz. Sem aparecer? Grave só as mãos." },
    { foto: "capa", texto: "Chama no WhatsApp que a gente separa", gravar: "Chamada final: os presentes na sacola da loja." }
  ],

  stories: {
    pergunta: "Qual você daria de presente?",
    detalhe: "Esse aqui sai por {preco} e já vai embrulhado.",
    final: "Quer saber se tem na sua cor?",
    link: "Consultar disponibilidade"
  },

  /* Trechos públicos (o resto só na área da cliente) */
  trechos: {
    legenda: "Orçamento definido, presente resolvido 🎁\n\nSeparamos 3 presentes até R$ [valor] aqui na [nome da loja]…",
    roteiro: {
      nome: "Detalhes de perto: presentes até R$ [valor]",
      abertura: "Você segurando os 3 produtos (ou eles lado a lado na bancada). Texto na tela: \"3 presentes até R$ [valor]\".",
      cena: "Close no [produto 1]: mostre a textura ou o fecho, abrindo e fechando.",
      resto: "+ 3 cenas, texto na tela, legenda, chamada final e a versão para quem não quer aparecer"
    },
    calendario: [
      { dia: 1, peca: "Carrossel: 3 presentes até R$ [valor]" },
      { dia: 2, peca: "Reel: Detalhes de perto" },
      { dia: 3, peca: "Carrossel: Um presente para cada estilo" }
    ],
    calendarioResto: "+ 7 dias e a versão expressa de 3 dias"
  }
};
