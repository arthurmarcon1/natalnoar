/* POST /api/infinitepay?k=<token>  Aviso de pagamento da InfinitePay (webhook).
   O aviso não tem assinatura: só vale depois de conferir na InfinitePay (payment_check).
   Confirmado: gera o acesso do pedido (sempre o mesmo) e envia o e-mail. Avisos repetidos não criam outro acesso.
   Respostas: 200 = recebido (a InfinitePay não reenvia); 400 = falha temporária (a InfinitePay tenta de novo). */
import { json, lerCorpo } from "./_http.js";
import { lerPedido, conferirPagamento, acessoDoPedido, tokenWebhook, baseDoSite } from "../private/pagamento.js";
import { entregar } from "../private/entrega.js";
import { segredoConfere } from "../private/acesso.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "POST" });
  const segredo = process.env.ACESSO_SECRET;
  if (!segredo) return json(res, 400, { erro: "Servidor sem ACESSO_SECRET." });
  const k = new URL(req.url, "http://x").searchParams.get("k");
  if (!segredoConfere(k, tokenWebhook(segredo))) return json(res, 401, { erro: "Não autorizado." });
  let d; try { d = JSON.parse((await lerCorpo(req)) || "{}"); } catch { return json(res, 400, { erro: "JSON inválido." }); }
  const pedido = lerPedido(d.order_nsu, segredo);
  if (!pedido) return json(res, 200, { ok: true, ignorado: "pedido-desconhecido" });           // não é nosso: não adianta repetir
  const c = await conferirPagamento(pedido, { transacao: d.transaction_nsu, slug: d.invoice_slug || d.slug });
  if (!c.pago) return json(res, /^http-5/.test(c.motivo) ? 400 : 200, { ok: !/^http-5/.test(c.motivo), pago: false, motivo: c.motivo });
  const acesso = acessoDoPedido(pedido, segredo, baseDoSite(req));
  const envio = await entregar(pedido, acesso);
  // e-mail não saiu: 400 para a InfinitePay tentar de novo (o acesso é o mesmo; a cliente também pode reenviar na página)
  return json(res, envio.enviado ? 200 : 400, { ok: envio.enviado, pago: true, email: envio.enviado ? "enviado" : envio.motivo });
}
