import { notFound } from "../src/components/not-found.mjs";
import {
  nmi,
  webdev,
  playground,
  missingCourse,
} from "../src/components/coursework.mjs";
import { mkdir, writeFile, readFile, cp, rm } from "node:fs/promises";
import { build } from "esbuild";
import { documentShell } from "../src/components/shared.mjs";
import { home } from "../src/components/home.mjs";
import { work } from "../src/components/work.mjs";
await mkdir("assets/generated", { recursive: true });
await build({
  entryPoints: ["styles.css"],
  bundle: true,
  minify: true,
  outfile: "assets/generated/site.css",
  external: ["/assets/*"],
});
await build({
  entryPoints: ["src/scenes/RackLab.tsx"],
  bundle: true,
  format: "esm",
  jsx: "automatic",
  minify: true,
  target: ["es2020"],
  outfile: "assets/generated/scenes.js",
  define: { "process.env.NODE_ENV": '"production"' },
});
await writeFile(
  "index.html",
  documentShell({
    title: "Chigekwu Chukwuezi — Creative Technologist",
    description:
      "Code, design, and creative technology. The portfolio of Chigekwu Chukwuezi, Computer Science student at the University of Georgia.",
    body: home(),
  }),
);
await writeFile(
  "work/index.html",
  documentShell({
    title: "Selected Work — Chigekwu Chukwuezi",
    description:
      "Explore software development, UX and product design, graphic design and public relations projects by Chigekwu Chukwuezi.",
    body: work(),
    page: "work",
  }),
);
for (const [path, title, render] of [
  ["nmi-portfolio/index.html", "NMI Portfolio", nmi],
  ["nmi-portfolio/webdev/index.html", "Web Development", webdev],
  [
    "nmi-portfolio/webdev/playground/index.html",
    "Playground Assignments",
    playground,
  ],
  [
    "nmi-portfolio/webdev/project-four/index.html",
    "Project Four",
    missingCourse,
  ],
]) {
  await mkdir(path.slice(0, path.lastIndexOf("/")), { recursive: true });
  await writeFile(
    path,
    documentShell({
      title: title + " — Chigekwu Chukwuezi",
      description: "New Media Institute coursework by Chigekwu Chukwuezi.",
      body: render(),
      page: "coursework",
      path: path.replace("index.html", ""),
    }),
  );
}
await writeFile(
  "404.html",
  documentShell({
    title: "Page not found — Chigekwu Chukwuezi",
    description: "Return to the portfolio of Chigekwu Chukwuezi.",
    body: notFound(),
    page: "not-found",
    path: "404.html",
    noindex: true,
  }),
);
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const path of [
  "index.html",
  "styles.css",
  "tokens.css",
  "404.html",
  "script.js",
  "favicon.svg",
  "CNAME",
  "assets",
  "work",
  "nmi-portfolio",
]) {
  await cp(path, `dist/${path}`, { recursive: true });
}
// Fail the build if an accidental domain migration slips in.
if ((await readFile("dist/CNAME", "utf8")).trim() !== "cgchukwuezi.com")
  throw new Error("Unexpected domain configuration");
console.log(
  "Built static portfolio in dist/. GitHub Pages root output refreshed.",
);
