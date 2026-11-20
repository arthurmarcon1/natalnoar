/* POST /api/liberar  (cabeçalho x-admin-token: <ADMIN_TOKEN>)
   Corpo JSON: { "campanha": "presentes-por-orcamento", "dias": 365, "referencia": "pedido-123" }
   Gera um link de acesso à área da cliente. Uso do Arthur (revisão, cortesia ou venda manual)
   enquanto a plataforma de pagamento não estiver ligada ao webhook (api/pagamento.js). */
import { emitirToken, segredoConfere } from "../private/acesso.js";
import { CAMPANHAS } from "../private/campanhas/index.js";
import { json, lerCorpo } from "./_http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { erro: "Método não permitido." }, { Allow: "POST" });
  const { ADMIN_TOKEN, ACESSO_SECRET } = process.env;
  if (!ADMIN_TOKEN || !ACESSO_SECRET) return json(res, 503, { erro: "Servidor sem ADMIN_TOKEN/ACESSO_SECRET." });
  if (!segredoConfere(req.headers["x-admin-token"], ADMIN_TOKEN)) return json(res, 401, { erro: "Não autorizado." });
  let corpo;
  try { corpo = JSON.parse((await lerCorpo(req)) || "{}"); } catch { return json(res, 400, { erro: "JSON inválido." }); }
  const campanha = String(corpo.campanha || "");
  if (!CAMPANHAS[campanha]) return json(res, 400, { erro: "Campanha desconhecida.", disponiveis: Object.keys(CAMPANHAS) });
  const dias = Math.min(Math.max(1, Number(corpo.dias) || 365), 3650);
  const token = emitirToken({ campanha, dias, referencia: String(corpo.referencia || "").slice(0, 60) }, ACESSO_SECRET);
  const base = process.env.SITE_URL || `https://${req.headers.host}`;
  return json(res, 200, { link: `${base}/#acesso=${token}`, expiraEmDias: dias });
}
