/* POST /api/ipg?k=<token>&p=<pedido>  Aviso servidor a servidor do IPG do Sicredi (transactionNotificationURL).
   Só vale com o notification_hash conferido (shared secret). Aprovado: envia o e-mail com o acesso
   (sempre o mesmo link para o mesmo pedido; avisos repetidos não criam outro acesso). */
import { json, lerCorpo } from "./_http.js";
import { lerPedido, acessoDoPedido, tokenWebhook, baseDoSite } from "../private/pagamento.js";
import { conferirIPG, lerFormulario } from "../private/ipg.js";
import { entregar } from "../private/entrega.js";
import { segredoConfere } from "../private/acesso.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "POST" });
  const segredo = process.env.ACESSO_SECRET;
  if (!segredo) return json(res, 500, { erro: "Servidor sem ACESSO_SECRET." });
  const q = new URL(req.url, "http://x").searchParams;
  if (!segredoConfere(q.get("k"), tokenWebhook(segredo))) return json(res, 401, { erro: "Não autorizado." });
  const pedido = lerPedido(q.get("p"), segredo);
  if (!pedido) return json(res, 200, { ok: true, ignorado: "pedido-desconhecido" });
  let d; try { d = lerFormulario(await lerCorpo(req)); } catch { return json(res, 400, { erro: "Aviso inválido." }); }
  const c = conferirIPG(pedido, d, { tipo: "aviso", segredo });
  if (!c.valido) return json(res, 401, { ok: false, motivo: c.motivo });
  if (!c.pago) return json(res, 200, { ok: true, pago: false, status: c.status });
  const envio = await entregar(pedido, acessoDoPedido(pedido, segredo, baseDoSite(req)));
  return json(res, envio.enviado ? 200 : 500, { ok: envio.enviado, pago: true, email: envio.enviado ? "enviado" : envio.motivo });
}
