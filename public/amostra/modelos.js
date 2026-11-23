/* =====================================================================
   GALERIA DE MODELOS: carrosséis de exemplo, já preenchidos.

   Coleção Presentes por orçamento (5 carrosséis-base, 4 telas cada,
   legenda própria) + capa-piloto de Por trás do resultado (outra coleção).
   As fotos são as provisórias de public/assets/exemplo/ (trocáveis).
   O kit pago usa as MESMAS composições com os textos de
   private/campanhas/ (marcadores como [produto] e [preço]).
   ===================================================================== */
const F = n => `assets/exemplo/${n}`;
const presentes = F("01-presentes.jpg"), clutch = F("02-clutch.jpg"), lenco = F("03-lenco.jpg"), brincos = F("04-brincos.jpg");
const MARCA = "Ateliê Aurora";

export const MODELOS = {
  "faixa-de-preco": {
    colecao: "presentes", ordem: 1, marca: MARCA,
    nome: "Presentes por faixa de preço",
    ideia: "Abre com o valor em destaque. Uma foto grande por tela, com o preço numa etiqueta.",
    telas: [
      { layout: "faixa-capa", texto: "3 presentes até", preco: "R$ 100", apoio: "Arrasta pro lado →", foto: presentes },
      { layout: "faixa-produto", texto: "Clutch Noite", preco: "R$ 89", apoio: "Para a mãe que ama sair", foto: clutch },
      { layout: "faixa-produto", texto: "Lenço de seda", preco: "R$ 59", apoio: "Para a amiga do amigo secreto", foto: lenco },
      { layout: "faixa-produto", texto: "Brincos dourados", preco: "R$ 79", apoio: "Para a irmã que ama um brilho", foto: brincos }
    ],
    legenda: "Orçamento definido, presente resolvido 🎁\n\nSeparamos 3 presentes até R$ 100 aqui na Ateliê Aurora: a Clutch Noite para a mãe que ama sair, o lenço de seda para a amiga do amigo secreto e os brincos dourados para a irmã que ama um brilho.\n\nQual combina com quem você vai presentear? Chama no WhatsApp que a gente embrulha.\n\n#presentedenatal"
  },
  "cada-estilo": {
    colecao: "presentes", ordem: 2, marca: MARCA,
    nome: "Um presente para cada estilo",
    ideia: "A capa mostra os estilos em etiquetas. Cada produto aparece numa polaroide com o estilo de quem vai ganhar.",
    telas: [
      { layout: "estilo-capa", texto: "Um presente para cada estilo", apoio: "Qual é o de quem você vai presentear?", chips: ["Clássica", "Chama atenção", "Correria"], foto: presentes, ajuste: { zoom: 1.1, fx: 0.5, fy: 0.42 } },
      { layout: "estilo-produto", texto: "Clutch Noite", preco: "R$ 89", apoio: "Para quem é clássica", foto: clutch },
      { layout: "estilo-produto", texto: "Lenço de seda", preco: "R$ 59", apoio: "Para quem gosta de chamar atenção", foto: lenco },
      { layout: "estilo-produto", texto: "Brincos dourados", preco: "R$ 79", apoio: "Para quem vive na correria", foto: brincos }
    ],
    legenda: "Cada pessoa tem um estilo, e o presente certo conversa com ele 💫\n\nClássica? Clutch Noite. Gosta de chamar atenção? Lenço de seda. Vive na correria? Brincos dourados, leves para o dia todo.\n\nMe conta como é a pessoa que eu te ajudo a escolher. É só chamar no WhatsApp ou no direct da Ateliê Aurora."
  },
  "favorito-da-loja": {
    colecao: "presentes", ordem: 3, marca: MARCA,
    nome: "O favorito da loja",
    ideia: "Começa num close do detalhe e revela a peça inteira ao deslizar, com o preço no final.",
    telas: [
      { layout: "favorito-capa", texto: "O favorito da Ateliê Aurora", apoio: "E por que ele é um ótimo presente →", foto: clutch, ajuste: { zoom: 2.4, fx: 0.5, fy: 0.55 } },
      { layout: "favorito-revela", texto: "O fecho dourado", apoio: "O detalhe que encanta", foto: clutch, ajuste: { zoom: 1.7, fx: 0.5, fy: 0.55 } },
      { layout: "favorito-revela", texto: "O acabamento", apoio: "Feito para durar muitas festas", foto: clutch, ajuste: { zoom: 1.3, fx: 0.5, fy: 0.5 } },
      { layout: "favorito-revela", texto: "Clutch Noite", preco: "R$ 89", apoio: "Combina com quase todo mundo", foto: clutch, ajuste: { zoom: 1, fx: 0.5, fy: 0.5 } }
    ],
    legenda: "Se a gente tivesse que escolher um só presente, seria esse ❤️\n\nA Clutch Noite é a queridinha da Ateliê Aurora neste Natal: fecho dourado, acabamento caprichado e combina com quase todo mundo.\n\nSai por R$ 89 e já vai embrulhada. Quer reservar a sua? Chama no WhatsApp."
  },
  "duplas": {
    colecao: "presentes", ordem: 4, marca: MARCA,
    nome: "Duplas que combinam",
    ideia: "Duas fotos lado a lado em todas as telas, ligadas por um \"+\". O preço é o da dupla.",
    telas: [
      { layout: "dupla-capa", texto: "Duplas que combinam", apoio: "Presente em dobro, escolha pela metade →", foto: clutch, foto2: lenco },
      { layout: "dupla-produto", texto: "Clutch + Lenço de seda", preco: "R$ 139", apoio: "Para a mãe", foto: clutch, foto2: lenco },
      { layout: "dupla-produto", texto: "Brincos + Lenço de seda", preco: "R$ 129", apoio: "Para a sogra", foto: brincos, foto2: lenco },
      { layout: "dupla-produto", texto: "Clutch + Brincos dourados", preco: "R$ 159", apoio: "Para a melhor amiga", foto: clutch, foto2: brincos }
    ],
    legenda: "Tem presente que fica ainda melhor em dupla 👯‍♀️\n\nMontamos 3 combinações na Ateliê Aurora: clutch + lenço para a mãe, brincos + lenço para a sogra e clutch + brincos para a melhor amiga.\n\nA gente embrulha junto. Quer montar a sua dupla? Chama no WhatsApp."
  },
  "ultimas-compras": {
    colecao: "presentes", ordem: 5, marca: MARCA,
    nome: "Últimas compras",
    ideia: "Fundo pinho e uma página de calendário com a data: o prazo é a primeira coisa que se vê.",
    telas: [
      { layout: "urgencia-capa", texto: "Ainda dá tempo", preco: "23/12", apoio: "Os prazos de Natal da Ateliê Aurora →", foto: presentes },
      { layout: "urgencia-info", texto: "Entrega até", preco: "23/12", apoio: "Pedido pelo WhatsApp até 18h", foto: presentes, ajuste: { zoom: 1.2, fx: 0.5, fy: 0.5 } },
      { layout: "urgencia-info", texto: "Retirada até", preco: "24/12", apoio: "Embrulhado e pronto para levar, até meio-dia", foto: brincos },
      { layout: "urgencia-produto", texto: "Lenço de seda", preco: "R$ 59", apoio: "Pronto pra presente agora", foto: lenco }
    ],
    legenda: "Deixou pra última hora? Respira, ainda dá tempo 🎄\n\n📦 Entrega: pedidos até 23/12, às 18h\n🛍️ Retirada na loja: até 24/12, meio-dia\n\nTudo embrulhado e pronto pra presente. Chama no WhatsApp que a Ateliê Aurora separa agora."
  }
};

/* capa-piloto de outra coleção, para comparar identidades */
export const PILOTOS = {
  "por-tras-do-resultado": {
    colecao: "bastidores", marca: "Bia Make",
    nome: "Por trás do resultado",
    ideia: "Folha de contato de filme sobre fundo escuro: bastidores, não vitrine.",
    tela: { layout: "bastidores-capa", texto: "Por trás de uma make que dura a festa toda", apoio: "Bia Make · bastidores", foto: F("07-glow.jpg") }
  }
};

export const modelosDaColecao = id => Object.entries(MODELOS).filter(([, m]) => m.colecao === id).sort((a, b) => a[1].ordem - b[1].ordem).map(([k, m]) => ({ id: k, ...m }));

/* Aplica a composição de um modelo ao conteúdo pago (telas com marcadores).
   Mantém os textos do kit; acrescenta layout, etiquetas de estilo e o
   enquadramento padrão (ex.: o close do "favorito"). Sem modelo: devolve igual. */
export function aplicarLayout(modelo, id) {
  const m = MODELOS[id];
  if (!m) return modelo;
  return {
    ...modelo,
    telas: modelo.telas.map((t, i) => {
      const ex = m.telas[i] || m.telas[m.telas.length - 1];
      const nt = { ...t, layout: ex.layout, chips: ex.chips, ajuste: ex.ajuste ? { ...ex.ajuste } : undefined };
      if (ex.layout === "urgencia-info") { const g = String(t.texto).match(/^(.*?\bat[eé])\s+(.+)$/i); if (g && !t.preco) { nt.texto = g[1]; nt.preco = g[2]; } }
      if (ex.layout === "urgencia-capa" && !t.preco) nt.preco = "[data]";
      return nt;
    })
  };
}
