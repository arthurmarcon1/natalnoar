/* Utilidades HTTP das funções (API do Node puro, funciona na Vercel e no servidor de teste). */
export function json(res, status, corpo, extras = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const [k, v] of Object.entries(extras)) res.setHeader(k, v);
  res.end(JSON.stringify(corpo));
}
export function lerCorpo(req, limite = 64 * 1024) {
  if (req.body !== undefined) return Promise.resolve(typeof req.body === "string" ? req.body : JSON.stringify(req.body));
  return new Promise((ok, erro) => {
    let s = "";
    req.on("data", c => { s += c; if (s.length > limite) { erro(new Error("corpo grande demais")); req.destroy(); } });
    req.on("end", () => ok(s)); req.on("error", erro);
  });
}
export const tokenDoPedido = req => {
  const h = req.headers["authorization"] || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
};
