import { interests } from "../data/profiles.mjs";
import { icon, link, sectionHeading } from "./shared.mjs";
export function outsideOfWork() {
  return `<section id="currently" class="section-wrap outside-section">${sectionHeading("06", "Outside of Work", "A quieter side of my day.")}<div class="outside-grid">${interests.map((p) => `<article class="interest-entry"><div class="interest-platform">${icon(p.icon)}<span>${p.platform}</span></div><h2>${p.heading}</h2><p>${p.description}</p>${link(p.href, p.label)}</article>`).join("")}</div><div class="outside-notes"><p class="small-note">Also on the bookshelf and the screen</p><div>${link("https://www.goodreads.com/user/show/183826543", "View my reading on Goodreads")}${link("https://letterboxd.com/cgeezeey/", "View my films on Letterboxd")}</div></div></section>`;
}
