// Grava o vídeo tutorial (public/video/tutorial.html) quadro a quadro e junta em MP4 com o ffmpeg.
// Precisa do servidor local (npm run dev), de Playwright e do ffmpeg:
//   URL=http://localhost:8767/ node tests/video/gravar.mjs docs/video/tutorial-natal-no-ar.mp4 [fps]
//   Outra página: PAGINA=video/tutorial2.html (identidade nova, com o vestido de poá).
import { chromium } from "playwright";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
const [saida = "tutorial.mp4", fpsArg] = process.argv.slice(2), fps = +fpsArg || 30, URL = process.env.URL || "http://localhost:8767/";
const pasta = mkdtempSync(join(tmpdir(), "quadros-"));
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const erros = []; pg.on("pageerror", e => erros.push(e.message));
await pg.goto(URL + (process.env.PAGINA || "video/tutorial.html") + "?gravar"); await pg.evaluate(() => window.pronto);
const total = Math.round((await pg.evaluate(() => window.DURACAO)) * fps), palco = pg.locator("#palco");
for (let i = 0; i < total; i++) {
  await pg.evaluate(t => window.quadro(t), i / fps);
  await palco.screenshot({ path: join(pasta, `${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 94 });
  if (i % fps === 0) process.stdout.write(`\r${Math.round(i / fps)} s de ${total / fps}`);
}
await b.close();
if (erros.length) { console.error("\nErros na página:", erros); process.exit(1); }
execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-framerate", String(fps), "-i", join(pasta, "%05d.jpg"), "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", saida], { stdio: "inherit" });
rmSync(pasta, { recursive: true, force: true });
console.log(`\nPronto: ${saida} (${total} quadros, ${fps} fps)`);
