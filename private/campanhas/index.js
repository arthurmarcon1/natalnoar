/* Conteúdo pago de cada campanha. Só é entregue pela função api/campanha.js,
   para quem tem um link de acesso válido. Nada daqui é servido como arquivo público. */
import presentesPorOrcamento from "./presentes-por-orcamento.js";

export const CAMPANHAS = {
  "presentes-por-orcamento": presentesPorOrcamento
};
