import { readFileSync } from "node:fs";
import { typographicTree } from "./tree.mjs";
import { icon, link, sectionHeading } from "./shared.mjs";
import { selectedWork } from "./projects.mjs";
const original = JSON.parse(
  readFileSync(new URL("../data/original-content.json", import.meta.url)),
);
function originalSection(id, title) {
  // Preserve every original fact and link, remove obsolete utility styling.
  const content = original[id]
    .replace(/^<section[^>]*>/, "")
    .replace(/<\/section>$/, "")
    .replace(/ class="[^"]*"/g, "")
    .replace(/<h2[^>]*>.*?<\/h2>/s, "");
  const safeContent = content
    .replace(/rel="noreferrer"/g, 'rel="noopener noreferrer"')
    .replace(
      /(<a [^>]*target="_blank"[^>]*>)(.*?)(<\/a>)/gs,
      '$1$2<span class="sr-only"> (opens in a new tab)</span>$3',
    );
  return `<section id="${id}" class="section-wrap archive-section ${id}-section">${sectionHeading(id === "experience" ? "03" : id === "skills" ? "04" : "05", title)}<h2 class="archive-title">${title}</h2>${safeContent}</section>`;
}
export function hero() {
  return `<section id="top" class="hero" aria-labelledby="hero-title"><div class="hero-topline"><p>At the intersection of<br>logic & imagination.</p><p>Computer Science @ UGA<br>New Media & creative technology</p></div>${typographicTree()}<div class="hero-message"><p class="eyebrow hero-kicker">Rooted in curiosity. Built with intention.</p><h1 id="hero-title"><span>I build digital experiences</span><br><span class="hero-second">where technology and creativity <em>grow together.</em></span></h1><div class="hero-actions"><a class="button button-dark" href="#work">Explore my work ${icon("down")}</a><a class="button button-line" href="#about">About me ${icon("external")}</a></div></div><div class="hero-bottom"><div><p class="hero-name">Chigekwu Chukwuezi</p><p class="hero-descriptor">Creative Technologist</p></div><p class="hero-availability"><span aria-hidden="true"></span>Open to opportunities</p><a href="#work" class="hero-scroll" aria-label="Scroll to explore selected work">Scroll to explore ${icon("down")}</a></div></section>`;
}
export function about() {
  const paragraphs = [...original.about.matchAll(/<p>(.*?)<\/p>/gs)].map((m) =>
    m[1].replace(/ class="[^"]*"/g, ""),
  );
  return `<section id="about" class="about-section section-wrap">${sectionHeading("02", "A little about me", "The person behind the projects.")}<div class="about-layout"><div class="about-heading"><h2>Curiosity is<br>my <em>constant.</em></h2><img src="/assets/work/chigekwu-portrait.jpg" width="540" height="720" loading="lazy" decoding="async" alt="Portrait of Chigekwu Chukwuezi"><p class="small-note">Chigekwu Chukwuezi / Creative Technologist</p></div><div class="about-copy"><p class="about-lead">Computer Science student with hands-on experience troubleshooting hardware, connected devices, communication systems, and end-user technology.</p>${paragraphs.map((p) => `<p>${p}</p>`).join("")}<div class="about-links">${link("#experience", "My experience")}${link("#skills", "Core skills")}${link("#education", "Education")}${link("/assets/chukwuezi_resume.pdf", "View resume")}</div><p class="eyebrow opportunity-label">Seeking opportunities</p><p>Networking · Systems Administration · IT Infrastructure · Technical Support</p></div></div></section>`;
}
export function home() {
  return (
    hero() +
    selectedWork() +
    about() +
    originalSection("experience", "Experience") +
    originalSection("skills", "Core Skills") +
    originalSection("education", "Education & community") +
    `<section id="currently" class="section-wrap outside-section">${sectionHeading("06", "Outside of Work", "A few things I keep coming back to.")}<div class="outside-grid"><div><span class="eyebrow">On the bookshelf</span><h2>Another chapter.</h2>${link("https://www.goodreads.com/user/show/183826543", "View my reading on Goodreads")}</div><div><span class="eyebrow">On the screen</span><h2>A different lens.</h2>${link("https://letterboxd.com/cgeezeey/", "View my films on Letterboxd")}</div></div></section>`
  );
}
