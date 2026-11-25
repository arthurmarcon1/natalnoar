/* POST /api/pedido  { campanha, plano, email, confirmacao }
   Registra o pedido (assinado, com o preço do servidor) e gera o link de pagamento da InfinitePay.
   Resposta: { url, pedido, resumo }. A cliente segue para a url e paga lá.
   Teste com compra real de valor baixo: cabeçalho x-admin-token + { teste: true } usa PRECO_TESTE_CENTAVOS. */
import { json, lerCorpo } from "./_http.js";
import { segredoConfere } from "../private/acesso.js";
import { criarPedido, criarLink, resumoPedido, baseDoSite } from "../private/pagamento.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "POST" });
  let corpo; try { corpo = JSON.parse((await lerCorpo(req)) || "{}"); } catch { return json(res, 400, { erro: "Pedido inválido." }); }
  const email = String(corpo.email || "").trim().toLowerCase();
  if (email !== String(corpo.confirmacao || "").trim().toLowerCase()) return json(res, 400, { erro: "Os dois e-mails não são iguais." });
  const teste = corpo.teste === true && segredoConfere(req.headers["x-admin-token"], process.env.ADMIN_TOKEN);
  try {
    const segredo = process.env.ACESSO_SECRET, pedido = criarPedido({ campanha: corpo.campanha, plano: corpo.plano, email, teste }, segredo);
    const url = await criarLink(pedido, { base: baseDoSite(req), segredo });
    return json(res, 200, { url, pedido: pedido.nsu, resumo: resumoPedido(pedido) });
  } catch (e) { return json(res, e.status || 500, { erro: e.status ? e.message : "Não foi possível iniciar o pagamento." }); }
}
