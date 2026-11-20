/* Conteúdo pago de cada campanha. Só é entregue pela função api/campanha.js,
   para quem tem um link de acesso válido, e filtrado pelo plano comprado. */
import presentesPorOrcamento from "./presentes-por-orcamento.js";
import seuToqueNasFestas from "./seu-toque-nas-festas.js";

export const CAMPANHAS = {
  "presentes-por-orcamento": presentesPorOrcamento,
  "seu-toque-nas-festas": seuToqueNasFestas
};
