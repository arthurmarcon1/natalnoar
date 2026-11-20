/* Acesso à área paga: link assinado (HMAC-SHA256), sem banco de dados.
   Token = base64url(JSON {c: campanha, e: expira (s), r: referência}) + "." + base64url(assinatura).
   O segredo fica só no servidor (variável de ambiente ACESSO_SECRET). */
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

const b64 = buf => Buffer.from(buf).toString("base64url");
const assinar = (dados, segredo) => createHmac("sha256", segredo).update(dados).digest();

export function emitirToken({ campanha, dias = 365, referencia = "" }, segredo, agora = Date.now()) {
  if (!segredo || segredo.length < 32) throw new Error("ACESSO_SECRET ausente ou curto (mínimo 32 caracteres).");
  if (!campanha) throw new Error("Campanha obrigatória.");
  const dados = b64(JSON.stringify({ c: campanha, e: Math.floor(agora / 1000) + dias * 86400, r: referencia || b64(randomBytes(6)) }));
  return `${dados}.${b64(assinar(dados, segredo))}`;
}

/* Devolve { campanha, expira, referencia } ou null (inválido, adulterado ou expirado). */
export function verificarToken(token, segredo, agora = Date.now()) {
  if (!segredo || typeof token !== "string" || token.length > 2000) return null;
  const [dados, sig, ...resto] = token.split(".");
  if (!dados || !sig || resto.length) return null;
  let recebida;
  try { recebida = Buffer.from(sig, "base64url"); } catch { return null; }
  const esperada = assinar(dados, segredo);
  if (recebida.length !== esperada.length || !timingSafeEqual(recebida, esperada)) return null;
  let p;
  try { p = JSON.parse(Buffer.from(dados, "base64url").toString("utf8")); } catch { return null; }
  if (!p || typeof p.c !== "string" || typeof p.e !== "number" || p.e * 1000 < agora) return null;
  return { campanha: p.c, expira: new Date(p.e * 1000).toISOString(), referencia: p.r };
}

/* Comparação de segredos em tempo constante (token de administrador). */
export function segredoConfere(recebido, esperado) {
  if (!recebido || !esperado) return false;
  const a = Buffer.from(String(recebido)), b = Buffer.from(String(esperado));
  return a.length === b.length && timingSafeEqual(a, b);
}
