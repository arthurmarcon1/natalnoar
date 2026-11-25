/* POST /api/pagamento: rota antiga, desativada.
   O pagamento automático agora é o da InfinitePay: pedido em api/pedido.js, aviso de pagamento em
   api/infinitepay.js, volta da cliente em api/retorno.js (ver docs/pagamento-infinitepay.md).
   Esta rota responde 503 e não libera nada. */
import { json } from "./_http.js";

export default function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "POST" });
  return json(res, 503, { erro: "Rota desativada: o aviso de pagamento é recebido em /api/infinitepay. Nenhum acesso foi liberado." });
}
