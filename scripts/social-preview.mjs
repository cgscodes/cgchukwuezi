// A native typographic composition, rendered to the OG bitmap with local fonts.
import { chromium } from "playwright";
import { typographicTree } from "../src/components/tree.mjs";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
try {
  await page.goto("http://127.0.0.1:8001/");
  await page.setContent(
    `<!doctype html><html lang="en"><head><base href="http://127.0.0.1:8001/"><link rel="stylesheet" href="/styles.css"><style>body{width:1200px;height:630px;overflow:hidden;background:var(--palette-sky);padding:64px}.tree-art{position:absolute;right:32px;top:16px;width:600px;margin:0;opacity:.55}.tree-art svg{mask-image:none}h1{position:absolute;bottom:112px;left:64px;max-width:960px;font-size:80px;line-height:1.02}h1 em{background:var(--palette-sky)}.identity{position:absolute;bottom:48px;left:64px;font-size:20px}.brand{font-size:24px;font-weight:700}</style></head><body><p class="brand">cgchuk.</p>${typographicTree()}<h1>I build digital experiences<br>where technology and<br><em>creativity grow together.</em></h1><p class="identity">Chigekwu Chukwuezi · Creative Technologist</p></body></html>`,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "assets/social-preview.png" });
} finally {
  await browser.close();
}
