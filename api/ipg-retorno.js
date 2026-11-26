/* POST /api/ipg-retorno?p=<pedido>  Volta da cliente do IPG (responseSuccessURL / responseFailURL).
   O IPG envia o resultado como formulário. Só vale com o response_hash conferido; então leva a cliente
   para a página de retorno do site: aprovado (com um comprovante do nosso servidor), aguardando ou recusado. */
import { lerCorpo } from "./_http.js";
import { lerPedido, baseDoSite } from "../private/pagamento.js";
import { conferirIPG, lerFormulario, comprovante } from "../private/ipg.js";

const ir = (res, url) => { res.statusCode = 303; res.setHeader("Location", url); res.setHeader("Cache-Control", "no-store"); res.end(); };
export default async function handler(req, res) {
  const base = baseDoSite(req), segredo = process.env.ACESSO_SECRET;
  const nsu = new URL(req.url, "http://x").searchParams.get("p") || "";
  const pedido = segredo ? lerPedido(nsu, segredo) : null;
  if (req.method !== "POST" || !pedido) return ir(res, `${base}/#retorno?erro=pedido`);
  let d = {}; try { d = lerFormulario(await lerCorpo(req)); } catch {}
  const c = conferirIPG(pedido, d, { tipo: "resposta", segredo });
  const p = encodeURIComponent(nsu);
  if (!c.valido) return ir(res, `${base}/#retorno?pedido=${p}&erro=confirmacao`);
  if (c.pago) return ir(res, `${base}/#retorno?pedido=${p}&comprovante=${comprovante(pedido, segredo)}`);
  if (c.status === "WAITING") return ir(res, `${base}/#retorno?pedido=${p}&espera=1`);
  return ir(res, `${base}/#retorno?pedido=${p}&recusado=1`);
}
