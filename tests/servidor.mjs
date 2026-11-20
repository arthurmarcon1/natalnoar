// Servidor local que imita a Vercel: serve public/ como arquivos e /api/* pelas funções.
// Uso: ACESSO_SECRET=... ADMIN_TOKEN=... node tests/servidor.mjs [porta]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("../", import.meta.url));
const pub = join(raiz, "public");
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".json": "application/json", ".svg": "image/svg+xml" };
const porta = +process.argv[2] || 8767;

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.startsWith("/api/")) {
    const nome = url.pathname.slice(5).replace(/[^a-z0-9-]/gi, "");
    if (!nome || nome.startsWith("_")) { res.statusCode = 404; return res.end(); }
    try { const mod = await import(join(raiz, "api", `${nome}.js`)); return mod.default(req, res); }
    catch { res.statusCode = 404; return res.end("não encontrado"); }
  }
  let caminho = normalize(join(pub, decodeURIComponent(url.pathname)));
  if (!caminho.startsWith(pub)) { res.statusCode = 403; return res.end(); }
  try { if ((await stat(caminho)).isDirectory()) caminho = join(caminho, "index.html"); res.setHeader("Content-Type", TIPOS[extname(caminho)] || "application/octet-stream"); res.end(await readFile(caminho)); }
  catch { res.statusCode = 404; res.end("não encontrado"); }
}).listen(porta, () => console.log(`http://localhost:${porta}/`));
