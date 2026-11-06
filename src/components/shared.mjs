import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Menu,
  X,
  Github,
  Linkedin,
  Headphones,
  PenLine,
  Sun,
  Moon,
} from "lucide-react";
import { socialProfiles, resume } from "../data/profiles.mjs";
const icons = {
  external: ArrowUpRight,
  right: ArrowRight,
  down: ArrowDown,
  up: ArrowUp,
  menu: Menu,
  close: X,
  github: Github,
  linkedin: Linkedin,
  music: Headphones,
  writing: PenLine,
  sun: Sun,
  moon: Moon,
};
export const icon = (name = "external", className) =>
  renderToStaticMarkup(
    createElement(icons[name], {
      className,
      size: 20,
      strokeWidth: 1.5,
      "aria-hidden": true,
      focusable: false,
    }),
  );
export const external = (href) =>
  /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
export const link = (href, label, cls = "text-link") =>
  `<a class="${cls}" href="${href}"${external(href)}>${label}${icon(/^https?:/.test(href) ? "external" : "right")}${/^https?:/.test(href) ? '<span class="sr-only"> (opens in a new tab)</span>' : ""}</a>`;
export function navigation(page = "home", path = "") {
  const items = [
    ["/work/", "Work"],
    ["/#about", "About"],
    ["/nmi-portfolio/webdev/playground/", "Playground"],
    [resume, "Resume"],
    ["/#contact", "Contact"],
  ];
  return `<a class="skip-link" href="#main-content">Skip to main content</a><header class="site-header glass glass-standard"><a class="wordmark" href="/#top" aria-label="cgchuk — Chigekwu Chukwuezi, home"${page === "home" ? ' aria-current="page"' : ""}>cgchuk<span aria-hidden="true">.</span></a><nav class="site-navigation" aria-label="Primary navigation" id="site-navigation">${items.map(([href, label]) => `<a href="${href}"${(page === "work" && label === "Work") || (path.includes("/playground") && label === "Playground") ? ' aria-current="page"' : ""}${label === "Resume" ? " download" : ""}>${label}${label === "Resume" ? icon("down") : ""}</a>`).join("")}<button class="theme-toggle button button-quiet" type="button" aria-label="Switch color theme" title="Switch color theme">${icon("sun", "theme-icon-sun")}${icon("moon", "theme-icon-moon")}<span class="theme-label">Theme</span></button></nav><button class="menu-toggle button button-quiet" type="button" aria-expanded="false" aria-controls="site-navigation" hidden><span>Menu</span>${icon("menu", "menu-icon-open")}${icon("close", "menu-icon-close")}</button></header>`;
}
export function sectionHeading(number, title, note = "") {
  return `<div class="section-heading"><p class="eyebrow">${number} / ${title}</p>${note ? `<p>${note}</p>` : ""}</div>`;
}
export function socialLinks() {
  return `<nav class="social-links" aria-label="Social profiles">${socialProfiles.map((p) => `<a href="${p.href}"${external(p.href)} aria-label="${p.name} profile (opens in a new tab)">${icon(p.icon)}<span>${p.name}</span>${icon("external")}</a>`).join("")}</nav>`;
}
export function footer() {
  return `<footer id="contact" class="site-footer"><div class="footer-inner"><div class="footer-top"><p class="eyebrow">Have something in mind?</p><p class="small-note">Code, design, or a good conversation.</p></div><h2>Let’s make<br><em>something matter.</em></h2><div class="footer-connect glass glass-subtle">${link("mailto:ccc18714@uga.edu", "Let’s talk", "button button-dark")}<p class="footer-opportunities">Interested in networking, systems, infrastructure, or technical-support opportunities? I’d be glad to connect.</p><a class="text-link" href="${resume}" download>Download résumé ${icon("down")}</a></div>${socialLinks()}<div class="footer-bottom"><span>© 2026 Chigekwu Chukwuezi</span><a href="#top">Back to top ${icon("up")}</a></div></div></footer>`;
}
export function documentShell({
  title,
  description,
  body,
  page = "home",
  path = page === "work" ? "work/" : "",
  noindex = false,
}) {
  return (
    `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#AFC9D9"><script>(()=>{let theme;try{theme=localStorage.getItem('cgchuk-theme')}catch{}document.documentElement.dataset.theme=theme==='light'||theme==='dark'?theme:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})();</script><title>${title}</title><meta name="description" content="${description}">${noindex ? '<meta name="robots" content="noindex">' : ""}<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="https://cgchukwuezi.com/${path}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="https://cgchukwuezi.com/${path}"><meta property="og:image" content="https://cgchukwuezi.com/assets/social-preview.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Chigekwu Chukwuezi — Creative Technologist. Code, design and digital experiences, with a typographic cgchuk tree."><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="/assets/fonts/serif-1.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/serif-0.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/inter-0.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/generated/site.css"><script async src="https://www.googletagmanager.com/gtag/js?id=G-CWQ9KXW79R"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CWQ9KXW79R');</script><script src="/script.js" defer></script></head><body class="${page}-page">${navigation(page, path)}<main id="main-content" tabindex="-1">${body}</main>${footer()}</body></html>`.replace(
      /[ \t]+$/gm,
      "",
    ) + "\n"
  );
}
