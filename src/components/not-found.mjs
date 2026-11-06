import { link } from "./shared.mjs";
export function notFound() {
  return `<section id="top" class="work-intro section-wrap"><p class="eyebrow">404 / Page not found</p><h1>This page<br>isn’t here.</h1><p class="course-subtitle">The address may have changed. You can return to the portfolio or browse the project collection.</p><div class="not-found-actions">${link("/", "Back to home", "button button-dark")}${link("/work/", "Explore work", "button button-line")}</div></section>`;
}
