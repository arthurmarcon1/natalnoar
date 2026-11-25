/* =====================================================================
   DEMONSTRAÇÃO PÚBLICA: Presentes por orçamento

   Só o que aparece para quem ainda não comprou: 3 produtos de exemplo,
   as telas de amostra e TRECHOS reais do kit (o começo de um roteiro, uma tela de Stories
   e os 3 primeiros dias do calendário). tests/logic.test.mjs confere que os trechos são iguais ao kit.
   O conteúdo completo fica em private/campanhas/ e só sai pela área da cliente.

   Para trocar as fotos provisórias pelas suas: substitua os arquivos em
   public/assets/exemplo/ mantendo os nomes (ou mude o campo "foto" abaixo).
   Fotos na vertical (4:5) funcionam melhor.
   ===================================================================== */
import { T, FOTOS as P } from "../catalogo/_base.js";

export default {
  marca: "Ateliê Aurora",
  faixa: "R$ 100",
  capaFoto: "assets/elementos/embrulho-capa.jpg",
  capa: { texto: "5 presentes até", preco: "R$ 100", apoio: "Arrasta pro lado →" },
  extras: ["Achados para o amigo secreto", "Uma peça, três jeitos de usar", "Escolhas da equipe"],
  reveillon: ["Cores da virada", "Looks para a virada", "Últimos dias do ano"],
  produtos: [
    { id: "clutch", nome: "Clutch Noite", preco: "R$ 89", paraQuem: "Para a mãe que ama sair", estilo: "Não perde uma festa?",
      detalhe: "O fecho dourado faz barulhinho de presente caro.", foto: "assets/exemplo/02-clutch.jpg" },
    { id: "lenco", nome: "Lenço de seda", preco: "R$ 59", paraQuem: "Para a amiga do amigo secreto", estilo: "Ama um clássico?",
      detalhe: "Cai bem no pescoço, no cabelo ou na alça da bolsa.", foto: "assets/exemplo/03-lenco.jpg" },
    { id: "brincos", nome: "Brincos dourados", preco: "R$ 79", paraQuem: "Para a irmã que ama um brilho", estilo: "Vive de brilho?",
      detalhe: "Leves para usar a noite toda, com brilho de festa.", foto: "assets/exemplo/04-brincos.jpg" }
  ],

  /* Prévia do Reel "Me diz como ela é" do kit. {produto}, {preco} e {estilo} viram o produto escolhido. */
  reel: [
    { foto: "capa", texto: "Me diz como ela é que eu te digo o presente.", gravar: "Abertura: você olhando para a câmera, com os 3 presentes escondidos atrás das costas." },
    { foto: "produto", texto: "{estilo} {produto}", gravar: "Mostre o presente de perto e gire devagar." },
    { foto: "produto", texto: "{produto} · {preco}", gravar: "Perto da luz, para brilhar. Sem aparecer? Só a sua mão girando o presente." },
    { foto: "capa", texto: "Marca aqui quem é cada uma 👇", gravar: "Final: os 3 presentes juntos na bancada. Você aponta para a câmera." }
  ],

  stories: {
    pergunta: "Qual você daria de presente?",
    detalhe: "Esse aqui sai por {preco} e já vai embrulhado.",
    final: "Quer saber se tem na sua cor?",
    link: "Consultar disponibilidade"
  },

  /* Trechos públicos, copiados do kit (o resto só na área da cliente) */
  trechos: {
    legenda: "Presente bom é aquele que parece ter sido escolhido só pra ela ✨\n\nA que não perde uma festa, a que ama um clássico, a que vive de brilho…",
    reel: {
      id: "r-cara-dela", nome: "Me diz como ela é", duracao: "15 a 20 segundos",
      abertura: { filmar: "Você olhando para a câmera, com os 3 presentes escondidos atrás das costas.", fala: "Me diz como ela é que eu te digo o presente." },
      cena: { filmar: "Mostre o primeiro presente de perto e gire devagar.", texto: "Não perde uma festa? [presente 1]" },
      resto: "+ 2 cenas, o final, a legenda e a versão para quem não quer aparecer"
    },
    story: { id: "s-cara-dela", nome: "Ela é mais…", tela: 2, adesivo: "Enquete: “Ela é mais…” · De festa / Clássica",
      ...T("st-enquete", { pergunta: "Ela é mais…", op1: "De festa", op2: "Clássica", dica: "Vota na enquete ↓" }, [P.clutch, P.lenco]) },
    calendario: [
      { dia: 1, pecas: ["Carrossel · 5 presentes até R$ 100", "Stories · Quanto você quer gastar?"] },
      { dia: 2, pecas: ["Reel · Tenho R$ 100. O que eu dou?"] },
      { dia: 3, pecas: ["Carrossel · É a cara dela.", "Stories · Ela é mais…"] }
    ],
    calendarioResto: "+ 7 dias com o que preparar para cada peça, e a versão expressa de 3 dias"
  }
};
