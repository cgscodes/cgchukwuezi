import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Menu,
  X,
  MoveUpRight,
} from "lucide-react";
const icons = {
  external: ArrowUpRight,
  right: ArrowRight,
  down: ArrowDown,
  up: ArrowUp,
  menu: Menu,
  close: X,
  diagonal: MoveUpRight,
};
export const icon = (name = "external") =>
  renderToStaticMarkup(
    createElement(icons[name], {
      size: 18,
      strokeWidth: 1.5,
      "aria-hidden": true,
      focusable: false,
    }),
  );
export const external = (href) =>
  /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
export const link = (href, label, cls = "text-link") =>
  `<a class="${cls}" href="${href}"${external(href)}>${label}${icon(/^https?:/.test(href) ? "external" : "right")}${/^https?:/.test(href) ? '<span class="sr-only"> (opens in a new tab)</span>' : ""}</a>`;
export function navigation(page = "home") {
  const items = [
    ["/work/", "Work"],
    ["/#about", "About"],
    ["/nmi-portfolio/webdev/playground/", "Playground"],
    ["/assets/chukwuezi_resume.pdf", "Resume"],
    ["/#contact", "Contact"],
  ];
  return `<a class="skip-link" href="#main-content">Skip to main content</a><header class="site-header"><a class="wordmark" href="/#top" aria-label="cgchuk — Chigekwu Chukwuezi, home">cgchuk<span aria-hidden="true">.</span></a><nav aria-label="Primary navigation" id="site-navigation">${items.map(([href, label]) => `<a href="${href}"${page === "work" && label === "Work" ? ' aria-current="page"' : ""}>${label}${label === "Resume" ? icon("external") : ""}</a>`).join("")}</nav><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" hidden><span>Menu</span>${icon("menu")}</button></header>`;
}
export function sectionHeading(number, title, note = "") {
  return `<div class="section-heading"><p class="eyebrow">${number} / ${title}</p>${note ? `<p>${note}</p>` : ""}</div>`;
}
export function footer() {
  return `<footer id="contact" class="site-footer"><div class="footer-top"><p class="eyebrow">Have something in mind?</p><p class="small-note">Code, design, or a good conversation.</p></div><h2>Let’s make<br><em>something matter.</em></h2><div class="footer-connect">${link("mailto:ccc18714@uga.edu", "Let’s talk", "button button-dark")}<div class="contact-links">${link("https://www.linkedin.com/in/cchukwuezi/", "LinkedIn")}${link("https://github.com/cgscodes/", "GitHub")}<a class="text-link" href="/assets/chukwuezi_resume.pdf" download>Download resume ${icon("down")}</a></div></div><p class="footer-opportunities">Interested in networking, systems, infrastructure, or technical-support opportunities? I’d be glad to connect.</p><div class="footer-bottom"><span>© 2026 Chigekwu Chukwuezi</span><span>Thoughtfully designed. Always growing.</span><a href="#top">Back to top ${icon("up")}</a></div></footer>`;
}
export function documentShell({
  title,
  description,
  body,
  page = "home",
  path = page === "work" ? "work/" : "",
}) {
  return (
    `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#AFC9D9"><title>${title}</title><meta name="description" content="${description}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="https://cgchukwuezi.com/${path}"><link rel="stylesheet" href="/styles.css"><script async src="https://www.googletagmanager.com/gtag/js?id=G-CWQ9KXW79R"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CWQ9KXW79R');</script><script src="/script.js" defer></script></head><body class="${page}-page">${navigation(page)}<main id="main-content" tabindex="-1">${body}</main>${footer()}</body></html>`.replace(
      /[ \t]+$/gm,
      "",
    ) + "\n"
  );
}
