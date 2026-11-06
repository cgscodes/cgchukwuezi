import { readFile, writeFile } from "node:fs/promises";
const paths = [
  "index.html",
  "work/index.html",
  "nmi-portfolio/index.html",
  "nmi-portfolio/webdev/index.html",
  "nmi-portfolio/webdev/playground/index.html",
];
const html = (await Promise.all(paths.map((p) => readFile(p, "utf8")))).join(
  "",
);
const urls = [
  ...new Set(
    [...html.matchAll(/<a\b[^>]*href="(https?:[^"]+)"/g)].map((m) =>
      m[1].replaceAll("&amp;", "&"),
    ),
  ),
];
const results = [];
for (let i = 0; i < urls.length; i += 4)
  await Promise.all(
    urls.slice(i, i + 4).map(async (url) => {
      try {
        let response = await fetch(url, {
          method: "HEAD",
          redirect: "follow",
          signal: AbortSignal.timeout(15000),
        });
        if ([403, 405].includes(response.status))
          response = await fetch(url, {
            redirect: "follow",
            signal: AbortSignal.timeout(15000),
          });
        await response.body?.cancel();
        results.push({ url, status: response.status, final: response.url });
      } catch (error) {
        results.push({ url, error: error.message });
      }
    }),
  );
await writeFile(
  "artifacts/external-links.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
