import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { projects } from "../src/data/projects.mjs";
const pages = [
  "index.html",
  "work/index.html",
  "nmi-portfolio/index.html",
  "nmi-portfolio/webdev/index.html",
  "nmi-portfolio/webdev/playground/index.html",
  "nmi-portfolio/webdev/project-four/index.html",
];
const documents = await Promise.all(
  pages.map((path) => readFile(path, "utf8")),
);
const hrefs = (html) =>
  [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) =>
    m[1].replaceAll("&amp;", "&"),
  );
function normalized(href, path = "index.html") {
  const url = new URL(href, "https://portfolio.local/" + path);
  return url.href.replace(/index\.html(?=#|$)/, "").replace(/\/$/, "");
}
test("all original portfolio destinations remain reachable from the redesign", async () => {
  const original = JSON.parse(
    await readFile("src/data/original-links.json", "utf8"),
  );
  const current = new Set(
    documents.flatMap((html, i) =>
      hrefs(html).map((href) => normalized(href, pages[i])),
    ),
  );
  for (const href of original) {
    if (href.startsWith("#"))
      assert(
        documents.some((html) => html.includes(`id="${href.slice(1)}"`)),
        "Missing original anchor: " + href,
      );
    else
      assert(
        current.has(normalized(href)),
        "Missing original destination: " + href,
      );
  }
});
test("every internal link on portfolio and collection pages has a real target", async () => {
  for (const [i, html] of documents.entries())
    for (const href of hrefs(html)) {
      const url = new URL(href, "https://portfolio.local/" + pages[i]);
      if (url.hostname !== "portfolio.local") continue;
      let file = decodeURIComponent(url.pathname).slice(1) || "index.html";
      if (file.endsWith("/")) file += "index.html";
      assert(
        (await stat(file)).isFile(),
        `${pages[i]} points to missing ${file}`,
      );
      if (url.hash && file.endsWith(".html")) {
        const target = await readFile(file, "utf8");
        assert(
          target.includes(`id="${url.hash.slice(1)}"`),
          `Missing anchor ${href} from ${pages[i]}`,
        );
      }
    }
});
test("project categories, Instagram destinations and safe external tabs are preserved", () => {
  assert.deepEqual(
    new Set(projects.map((p) => p.category)),
    new Set(["software", "design", "graphic"]),
  );
  assert.equal(
    projects.find((p) => p.id === "sigma").href,
    "https://www.instagram.com/theugasigmas/?hl=en",
  );
  assert.equal(
    projects.find((p) => p.id === "gdg").href,
    "https://www.instagram.com/gdg_tsu/",
  );
  for (const html of documents)
    for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      assert(
        /rel="[^"]*noopener/.test(match[0]) &&
          /rel="[^"]*noreferrer/.test(match[0]),
        match[0],
      );
    }
});
test("static pages expose content, semantic outline and analytics without client rendering", () => {
  for (const html of documents) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert(html.includes("G-CWQ9KXW79R"));
    assert(html.includes('id="main-content"'));
    assert(!html.includes("cdn.tailwindcss.com"));
  }
  for (const project of projects) assert(documents[1].includes(project.title));
  assert(documents[0].includes("I build digital experiences</span><br>"));
  assert(documents[0].includes('aria-hidden="true" focusable="false"'));
});
test("production artifact preserves the original domain, resume and course assets", async () => {
  assert.equal(
    (await readFile("dist/CNAME", "utf8")).trim(),
    "cgchukwuezi.com",
  );
  assert((await stat("dist/assets/chukwuezi_resume.pdf")).size > 0);
  assert(
    (await stat("dist/nmi-portfolio/webdev/final-project/index.html")).size > 0,
  );
  assert((await stat("dist/assets/generated/scenes.js")).size < 220000);
});
test("new personal profiles, semantic tokens, social image and 404 ship correctly", async () => {
  const home = documents[0];
  assert(home.includes("https://music.apple.com/profile/cgchukwuezi"));
  assert(home.includes("https://substack.com/@cgchuk"));
  assert(!home.includes('href="https://www.facebook.com'));
  assert(home.includes("Download résumé"));
  const og = await readFile("dist/assets/social-preview.png");
  assert.equal(og.readUInt32BE(16), 1200);
  assert.equal(og.readUInt32BE(20), 630);
  const error = await readFile("dist/404.html", "utf8");
  assert(error.includes("noindex"));
  assert(error.includes("Back to home"));
  assert((await stat("dist/tokens.css")).isFile());
  for (const html of documents) assert(html.includes("og:image"));
});
