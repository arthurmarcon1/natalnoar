/* =====================================================================
   DEMONSTRAÇÃO PÚBLICA: Seu toque nas festas (prestadoras de serviço)

   Só o que aparece para quem ainda não comprou: 3 serviços de exemplo,
   as telas de amostra e TRECHOS reais do kit (o começo de um roteiro, uma tela de Stories e os 3 primeiros dias do calendário).
   O conteúdo completo fica em private/campanhas/ e só sai pela área da cliente.

   Para trocar as fotos provisórias: substitua os arquivos 05 a 08 em
   public/assets/exemplo/ mantendo os nomes (ou mude o campo "foto").
   ===================================================================== */
import { T, FOTOS as P } from "../catalogo/_base.js";

export default {
  marca: "Bia Make",
  faixa: "as festas",
  capaFoto: "assets/exemplo/05-servico-capa.jpg",
  capa: { texto: "3 estilos para", preco: "as festas", apoio: "Qual é o seu? →" },
  /* Abertura da página inicial (ver presentes-por-orcamento.js). */
  abertura: { carrossel: "pronta-ceia", laterais: ["tres-estilos", "doce-ceia"], convite: "Quer ver com o nome da sua marca?", marcaVazia: "Nome da sua marca",
    publico: "Para maquiadoras, cabeleireiras, manicures, confeiteiras e decoradoras",
    primeiroDia: { carrossel: "pronta-ceia", instrucao: "Separe a foto de uma make de festa pronta e uma da pele de perto, e troque no carrossel." } },
  produtos: [
    { id: "make-leve", nome: "Make leve", preco: "R$ 120", paraQuem: "Para o almoço da firma", estilo: "Almoço da firma:",
      detalhe: "Pele fresca e boca rosada, que dura o dia todo.", foto: "assets/exemplo/06-make-leve.jpg" },
    { id: "glow", nome: "Glow dourado", preco: "R$ 160", paraQuem: "Para o jantar de Natal", estilo: "Jantar de Natal:",
      detalhe: "Iluminado e elegante, bonito em foto e ao vivo.", foto: "assets/exemplo/07-glow.jpg" },
    { id: "penteado", nome: "Penteado de festa", preco: "R$ 140", paraQuem: "Para a confraternização", estilo: "Confra:",
      detalhe: "Preso com acabamento de pérolas, firme a noite toda.", foto: "assets/exemplo/08-penteado.jpg" }
  ],
  extras: ["Uma dúvida que sempre me fazem", "Como escolho cada detalhe", "A história por trás de um trabalho"],
  reveillon: ["Produção para a virada", "Ritual de fim de ano", "Obrigada por este ano"],

  /* Prévia do Reel "Qual combina com a sua festa?" do kit. */
  reel: [
    { foto: "capa", texto: "Qual estilo combina com a sua festa?", gravar: "Abertura: você olhando para a câmera, com os pincéis na mão." },
    { foto: "produto", texto: "{estilo} {produto}", gravar: "O trabalho pronto, com a cliente virando o rosto devagar para a luz." },
    { foto: "produto", texto: "{produto} · {preco}", gravar: "Um detalhe do acabamento, de perto. Sem aparecer? Mostre só o resultado." },
    { foto: "capa", texto: "Comenta a sua festa 👇", gravar: "Final: você de novo, apontando para baixo." }
  ],

  stories: {
    pergunta: "Qual combina com a sua festa?",
    detalhe: "{produto} sai por {preco}.",
    final: "Quer esse para a sua festa?",
    link: "Falar no WhatsApp"
  },

  trechos: {
    legenda: "Cada festa pede um toque diferente ✨\n\nAlmoço da firma: make leve. Jantar de Natal: glow dourado. Confra: penteado de festa…",
    reel: {
      id: "r-tres-estilos", nome: "Qual combina com a sua festa?", duracao: "15 segundos",
      abertura: { filmar: "Você olhando para a câmera, com os pincéis na mão.", fala: "Qual estilo combina com a sua festa?" },
      cena: { filmar: "Trabalho 1 pronto, a cliente virando o rosto devagar para a luz.", texto: "Almoço da firma: make leve" },
      resto: "+ 2 cenas, o final, a legenda e a versão para quem não quer aparecer"
    },
    story: { id: "s-tres-estilos", nome: "Qual é a sua festa?", tela: 1, adesivo: "Enquete: “Qual é a sua festa?” · Almoço da firma / Jantar de Natal",
      ...T("st-enquete", { pergunta: "Qual é a *sua* festa?", op1: "Almoço da firma", op2: "Jantar de Natal", dica: "Vota na enquete ↓" }, [P.makeLeve, P.glow]) },
    calendario: [
      { dia: 1, pecas: ["Carrossel · Pronta para a ceia", "Stories · Pronta para a ceia?"] },
      { dia: 2, pecas: ["Reel · Do rosto lavado à ceia"] },
      { dia: 3, pecas: ["Carrossel · 3 estilos para as festas", "Stories · Qual é a sua festa?"] }
    ],
    calendarioResto: "+ 7 dias com o que preparar para cada peça, e a versão expressa de 3 dias"
  }
};
