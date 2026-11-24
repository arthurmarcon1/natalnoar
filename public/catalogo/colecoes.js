/* =====================================================================
   IDENTIDADE DE CADA COLEÇÃO (uma por campanha).
   fundo / texto / destaque / par / icone: a cliente pode trocar no editor.
   papel / moldura / textura: tratamento fixo da coleção (é o que a torna reconhecível).
   virada: variação usada nos 3 carrosséis de Réveillon da coleção.
   cores: sugestões testadas mostradas no editor.
   ===================================================================== */
export const COLECOES = {
  "presentes-por-orcamento": {
    nome: "Presentes por orçamento", publico: "loja",
    base: { fundo: "#F3E8DC", texto: "#5C0F1F", destaque: "#B0853F", papel: "#FFFBF5", par: "editorial", icone: "laco", moldura: "papel", textura: "grao" },
    virada: { fundo: "#5C0F1F", texto: "#F3E8DC", destaque: "#D4AF63", icone: "fogos" },
    cores: ["#5C0F1F", "#F3E8DC", "#B0853F", "#1E4A35", "#1B2A4A", "#A3122A"],
    identidade: "Marfim e vinho, títulos em Playfair Display, fotos em moldura de papel, etiqueta de presente com o preço, laço e embalagem como elementos."
  },
  "looks-para-celebrar": {
    nome: "Looks para celebrar", publico: "loja",
    base: { fundo: "#141113", texto: "#F1E3C8", destaque: "#C9A45C", papel: "#221C1F", par: "display", icone: "estrela", moldura: "fina", textura: "brilho" },
    virada: { fundo: "#F1E3C8", texto: "#141113", destaque: "#A8823A", icone: "taca" },
    cores: ["#141113", "#F1E3C8", "#C9A45C", "#3A0E1E", "#1F2B3D", "#E7B7B0"],
    identidade: "Preto de festa com champanhe e ouro, DM Serif Display, fotos sangradas com filete dourado e brilhos espalhados."
  },
  "favoritos-da-loja": {
    nome: "Favoritos da loja", publico: "loja",
    base: { fundo: "#DCC7A6", texto: "#283A2B", destaque: "#B5532F", papel: "#F7F0E3", par: "suave", icone: "ramo", moldura: "recorte", textura: "pontos" },
    virada: { fundo: "#283A2B", texto: "#F7F0E3", destaque: "#E0A85A", icone: "estrela" },
    cores: ["#DCC7A6", "#283A2B", "#B5532F", "#F7F0E3", "#6B3A2A", "#8A9A6B"],
    identidade: "Papel kraft, verde pinho e terracota, Fraunces com Jost, fotos de cantos bem redondos, selos e raminhos."
  },
  "natal-de-ultima-hora": {
    nome: "Natal de última hora", publico: "loja",
    base: { fundo: "#C8102E", texto: "#FFF4E0", destaque: "#FFC93C", papel: "#FFF4E0", par: "moderna", icone: "sino", moldura: "carimbo", textura: "listras" },
    virada: { fundo: "#1A1A2E", texto: "#FFF4E0", destaque: "#FFC93C", icone: "fogos" },
    cores: ["#C8102E", "#FFF4E0", "#FFC93C", "#1A1A2E", "#0E5E3A", "#FF7A00"],
    identidade: "Vermelho de urgência com amarelo, Bricolage Grotesque bem pesada, fotos como adesivos com borda branca, listras e sinos."
  },
  "looks-para-a-virada": {
    nome: "Looks para a virada", publico: "loja",
    base: { fundo: "#FAF6EE", texto: "#1D1A16", destaque: "#B8913A", papel: "#FFFFFF", par: "classica", icone: "fogos", moldura: "fina", textura: "confete" },
    virada: { fundo: "#1D1A16", texto: "#FAF6EE", destaque: "#D9B45A", icone: "taca" },
    cores: ["#FAF6EE", "#1D1A16", "#B8913A", "#E9D9C0", "#2E3A59", "#C9A0A0"],
    identidade: "Branco e dourado, Cormorant Garamond com Jost, filetes finos, confete discreto e fogos."
  },
  "por-tras-do-resultado": {
    nome: "Por trás do resultado", publico: "servico",
    base: { fundo: "#151311", texto: "#F6F1EA", destaque: "#D4B06A", papel: "#26221E", par: "suave", icone: "estrela", moldura: "filme", textura: "grao" },
    virada: { fundo: "#F6F1EA", texto: "#151311", destaque: "#B08A3E", icone: "fogos" },
    cores: ["#151311", "#F6F1EA", "#D4B06A", "#E7B7B0", "#2B3A33", "#8C2F2B"],
    identidade: "Estúdio escuro, Fraunces em itálico, fotos em quadro de filme, ponto REC e estrela dourada."
  },
  "seu-toque-nas-festas": {
    nome: "Seu toque nas festas", publico: "servico",
    base: { fundo: "#F4DCD6", texto: "#3B1E2B", destaque: "#B5476A", papel: "#FFF7F4", par: "instrument", icone: "estrela", moldura: "oval", textura: "grao" },
    virada: { fundo: "#3B1E2B", texto: "#F4DCD6", destaque: "#E3B26B", icone: "taca" },
    cores: ["#F4DCD6", "#3B1E2B", "#B5476A", "#FFF7F4", "#6E2C3E", "#C9A45C"],
    identidade: "Rosé e ameixa, Instrument Serif com Plus Jakarta Sans, fotos em oval, estrelas pequenas."
  },
  "um-tempo-para-cuidar": {
    nome: "Um tempo para cuidar", publico: "servico",
    base: { fundo: "#E3E6DA", texto: "#2F3B2E", destaque: "#7E8F62", papel: "#F8F6EF", par: "classica", icone: "ramo", moldura: "arco", textura: "linhas" },
    virada: { fundo: "#2F3B2E", texto: "#F1EFE6", destaque: "#C9B27A", icone: "estrela" },
    cores: ["#E3E6DA", "#2F3B2E", "#7E8F62", "#F1E7DA", "#6B5B4B", "#B88A7A"],
    identidade: "Sálvia e areia, Cormorant Garamond com Jost, fotos em arco, linhas de caderno e raminhos."
  },
  "memorias-de-dezembro": {
    nome: "Memórias de dezembro", publico: "servico",
    base: { fundo: "#EDE4D3", texto: "#2B2522", destaque: "#B23A2B", papel: "#FFFDF8", par: "editorial", icone: "floco", moldura: "polaroide", textura: "grao" },
    virada: { fundo: "#2B2522", texto: "#EDE4D3", destaque: "#D9A84E", icone: "fogos" },
    cores: ["#EDE4D3", "#2B2522", "#B23A2B", "#FFFDF8", "#24405A", "#6B7F5A"],
    identidade: "Papel de álbum, Playfair Display, fotos em polaroide, vermelho de revelação e flocos."
  },
  "um-ano-de-boas-historias": {
    nome: "Um ano de boas histórias", publico: "servico",
    base: { fundo: "#16213A", texto: "#F2EDE3", destaque: "#E3B04B", papel: "#F2EDE3", par: "moderna", icone: "estrela", moldura: "carimbo", textura: "pontos" },
    virada: { fundo: "#F2EDE3", texto: "#16213A", destaque: "#C08A1E", icone: "fogos" },
    cores: ["#16213A", "#F2EDE3", "#E3B04B", "#7A2E3A", "#2E5A4B", "#9BB0D0"],
    identidade: "Azul-noite e creme, Bricolage Grotesque, números grandes, fotos como recortes de arquivo e estrelas."
  }
};
/* estilo original de um carrossel: coleção + variação de Réveillon + ajuste próprio do carrossel */
export const EDITAVEIS = ["fundo", "texto", "destaque", "par", "icone"];
export function estiloOriginal(campanhaId, carrossel) {
  const col = COLECOES[campanhaId];
  return { ...col.base, ...(carrossel && carrossel.nivel === 3 ? col.virada : {}), ...((carrossel && carrossel.estilo) || {}) };
}
