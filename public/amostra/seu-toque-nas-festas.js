/* =====================================================================
   DEMONSTRAÇÃO PÚBLICA: Seu toque nas festas (prestadoras de serviço)

   Só o que aparece para quem ainda não comprou: 3 serviços de exemplo,
   as telas de amostra e TRECHOS de legenda, roteiro e calendário.
   O conteúdo completo fica em private/campanhas/ e só sai pela área da cliente.

   Para trocar as fotos provisórias: substitua os arquivos 05 a 08 em
   public/assets/exemplo/ mantendo os nomes (ou mude o campo "foto").
   ===================================================================== */
export default {
  marca: "Bia Make",
  faixa: "as festas",
  capaFoto: "assets/exemplo/05-servico-capa.jpg",
  capa: { texto: "3 estilos para", preco: "as festas", apoio: "Qual é o seu? →" },
  produtos: [
    { id: "make-leve", nome: "Make leve", preco: "R$ 120", paraQuem: "Para o almoço da firma",
      detalhe: "Pele fresca e boca rosada, que dura o dia todo.", foto: "assets/exemplo/06-make-leve.jpg" },
    { id: "glow", nome: "Glow dourado", preco: "R$ 160", paraQuem: "Para o jantar de Natal",
      detalhe: "Iluminado e elegante, bonito em foto e ao vivo.", foto: "assets/exemplo/07-glow.jpg" },
    { id: "penteado", nome: "Penteado de festa", preco: "R$ 140", paraQuem: "Para a confraternização",
      detalhe: "Preso com acabamento de pérolas, firme a noite toda.", foto: "assets/exemplo/08-penteado.jpg" }
  ],
  extras: ["Uma dúvida que sempre me fazem", "Como escolho cada detalhe", "A história por trás de um trabalho"],
  reveillon: ["Produção para a virada", "Ritual de fim de ano", "Obrigada por este ano"],

  reel: [
    { foto: "capa", texto: "3 estilos para as festas", gravar: "Abertura: você olhando para a câmera e perguntando qual estilo combina com a festa." },
    { foto: "produto", texto: "{produto} · {preco}", gravar: "Close no trabalho pronto, virando devagar para a luz." },
    { foto: "produto", texto: "{paraQuem}", gravar: "Mostre um detalhe do acabamento. Sem aparecer? Grave só o resultado e as mãos." },
    { foto: "capa", texto: "Me chama no WhatsApp", gravar: "Chamada final: suas mãos organizando o material de trabalho." }
  ],

  stories: {
    pergunta: "Qual combina com a sua festa?",
    detalhe: "{produto} sai por {preco}.",
    final: "Quer esse para a sua festa?",
    link: "Falar no WhatsApp"
  },

  trechos: {
    legenda: "Cada festa pede um toque diferente ✨\n\nSeparei 3 estilos para o fim de ano…",
    roteiro: {
      nome: "Qual combina com a sua festa?",
      abertura: "Você olhando para a câmera: \"Qual estilo combina com a sua festa?\".",
      cena: "Close no trabalho 1 pronto, virando devagar para a luz.",
      resto: "+ 3 cenas, texto na tela, legenda, chamada final e a versão para quem não quer aparecer"
    },
    calendario: [
      { dia: 1, peca: "Carrossel: 3 estilos para as festas" },
      { dia: 2, peca: "Reel: Qual combina com a sua festa?" },
      { dia: 3, peca: "Carrossel: Presente que vira cuidado" }
    ],
    calendarioResto: "+ 7 dias e a versão expressa de 3 dias"
  }
};
