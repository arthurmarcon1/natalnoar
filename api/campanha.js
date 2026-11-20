/* GET /api/campanha  (Authorization: Bearer <token de acesso>)
   Entrega o conteúdo pago da campanha do token, só o que o PLANO comprado libera.
   Sem token válido: 401. */
import { verificarToken } from "../private/acesso.js";
import { CAMPANHAS } from "../private/campanhas/index.js";
import { json, tokenDoPedido } from "./_http.js";
import { SITE } from "../public/config.js";
import { planoPorId, conteudoDoPlano } from "../public/js/logic.js";

export default function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { erro: "Método não permitido." }, { Allow: "GET" });
  const segredo = process.env.ACESSO_SECRET;
  if (!segredo) return json(res, 503, { erro: "Área da cliente ainda não configurada no servidor." });
  const acesso = verificarToken(tokenDoPedido(req), segredo);
  if (!acesso) return json(res, 401, { erro: "Acesso inválido ou expirado." });
  const conteudo = CAMPANHAS[acesso.campanha];
  if (!conteudo) return json(res, 404, { erro: "Campanha não encontrada." });
  const plano = planoPorId(SITE, acesso.plano);
  if (!plano) return json(res, 403, { erro: "Plano do acesso não reconhecido." });
  return json(res, 200, { acesso, plano, campanha: conteudoDoPlano(conteudo, plano) });
}
