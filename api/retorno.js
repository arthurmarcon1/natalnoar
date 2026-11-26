/* POST /api/retorno  { pedido, transacao, slug | comprovante, reenviar? }
   A cliente voltou do pagamento. A volta sozinha não comprova nada:
   - InfinitePay: confere na InfinitePay (transacao + slug).
   - IPG do Sicredi: vale o comprovante que /api/ipg-retorno deu depois de conferir o hash do IPG.
   Pago: { status: "pago", link, resumo } (e reenvia o e-mail se reenviar: true).
   Ainda não: { status: "pendente" }. Pedido inválido: 400. */
import { json, lerCorpo } from "./_http.js";
import { lerPedido, conferirPagamento, acessoDoPedido, resumoPedido, baseDoSite } from "../private/pagamento.js";
import { entregar } from "../private/entrega.js";
import { comprovanteConfere } from "../private/ipg.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "POST" });
  const segredo = process.env.ACESSO_SECRET;
  if (!segredo) return json(res, 503, { erro: "Pagamento ainda não configurado." });
  let d; try { d = JSON.parse((await lerCorpo(req)) || "{}"); } catch { return json(res, 400, { erro: "Pedido inválido." }); }
  const pedido = lerPedido(d.pedido, segredo);
  if (!pedido) return json(res, 400, { erro: "Não encontramos este pedido." });
  const c = d.comprovante ? { pago: comprovanteConfere(pedido, d.comprovante, segredo), metodo: "", motivo: "comprovante-invalido" } : await conferirPagamento(pedido, { transacao: d.transacao, slug: d.slug });
  if (!c.pago) return json(res, 200, { status: "pendente", motivo: c.motivo, resumo: resumoPedido(pedido) });
  const acesso = acessoDoPedido(pedido, segredo, baseDoSite(req));
  const envio = d.reenviar === true ? await entregar(pedido, acesso) : null;
  return json(res, 200, { status: "pago", link: acesso.link, token: acesso.token, metodo: c.metodo, resumo: resumoPedido(pedido), ...(envio ? { email: envio.enviado ? "enviado" : envio.motivo } : {}) });
}
