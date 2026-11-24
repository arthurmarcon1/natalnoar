/* =====================================================================
   CATÁLOGO DE CARROSSÉIS: 10 campanhas × 11 carrosséis (4 telas + legenda cada).
   Nível 1 = Natal Pronto (5), nível 2 = + 3 temas do Natal Completo,
   nível 3 = + 3 de Réveillon do Natal + Virada. Os planos são cumulativos.
   ===================================================================== */
import presentes from "./presentes-por-orcamento.js";
import celebrar from "./looks-para-celebrar.js";
import favoritos from "./favoritos-da-loja.js";
import ultimaHora from "./natal-de-ultima-hora.js";
import virada from "./looks-para-a-virada.js";
import bastidores from "./por-tras-do-resultado.js";
import toque from "./seu-toque-nas-festas.js";
import cuidar from "./um-tempo-para-cuidar.js";
import memorias from "./memorias-de-dezembro.js";
import ano from "./um-ano-de-boas-historias.js";
import { COLECOES, estiloOriginal, EDITAVEIS } from "./colecoes.js";
export { COLECOES, estiloOriginal, EDITAVEIS };

export const CATALOGO = Object.fromEntries([presentes, celebrar, favoritos, ultimaHora, virada, bastidores, toque, cuidar, memorias, ano].map(c => [c.id, c]));
export const GRUPOS = [[1, "Natal", "Natal Pronto"], [2, "Temas extras", "Natal Completo"], [3, "Réveillon", "Natal + Virada"]];

export const campanha = id => CATALOGO[id] || null;
export const carrossel = (campId, carrId) => { const c = CATALOGO[campId]; return (c && c.carrosseis.find(x => x.id === carrId)) || null; };
/* carrosséis que um nível de plano libera (cumulativo) */
export const carrosseisDoNivel = (campId, nivel) => (CATALOGO[campId] ? CATALOGO[campId].carrosseis.filter(x => x.nivel <= nivel) : []);
export const marcaExemplo = (campId, carr) => (carr && carr.marca) || (CATALOGO[campId] || {}).marca || "";

/* Legenda que acompanha a edição: {marca}, {2.preco1}, {2.nome.lower} (inicial minúscula).
   telas = [{ c: campos }] no estado atual; asteriscos de destaque saem do texto. */
const limpar = s => String(s ?? "").replace(/\*/g, "").trim();
export function legendaPreenchida(carr, telas, marca, exemplo) {
  const nome = (marca || "").trim() || exemplo || "[nome da loja]";
  return carr.legenda.replace(/\{(\d+)\.([a-z0-9]+)(?:\.(lower|plain))?\}/gi, (_, n, k, mod) => {
    const t = telas[+n - 1]; let v = limpar(t && t.c ? t.c[k] : "");
    v = v.replaceAll("{marca}", nome);
    if (mod === "lower" && v) v = v.charAt(0).toLowerCase() + v.slice(1);
    return v;
  }).replaceAll("{marca}", nome);
}
