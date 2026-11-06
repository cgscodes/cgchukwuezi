import { categories, projects } from "../data/projects.mjs";
import { icon, link, external } from "./shared.mjs";
export function stageShowScene() {
  return `<figure class="project-visual racklab-visual"><div class="stage-host" data-scene="racklab" role="img" aria-label="RackLab project presentation showing the actual server-rack configurator interface."><picture><source media="(max-width: 600px)" srcset="/assets/work/racklab-detail.jpg"><img class="scene-poster" src="/assets/work/racklab-interface.jpg" width="1440" height="960" alt="RackLab interface with an 18U server rack, equipment choices, capacity and power usage." loading="lazy" decoding="async"></picture></div><figcaption><span>Interactive systems, made tangible.</span><span>Actual application interface</span></figcaption></figure>`;
}
function visual(p) {
  if (p.visual === "racklab") return stageShowScene();
  if (p.visual === "wave")
    return `<figure class="project-visual wave-visual"><a href="${p.reel}"${external(p.reel)} aria-label="Watch Promoting WAVE on Instagram (opens in a new tab)"><img src="/assets/work/wave-promo-reel-thumbnail.jpg" srcset="/assets/work/wave-promo-reel-thumbnail-small.jpg 640w, /assets/work/wave-promo-reel-thumbnail.jpg 1053w" sizes="(max-width: 700px) 92vw, 55vw" width="1053" height="862" loading="lazy" decoding="async" alt="Three people talking in a campus hallway in the WAVE promotional video."><span class="visual-caption">Promoting WAVE ${icon("external")}</span></a><figcaption>A short promotional video introducing WAVE and its role in the campus event experience.</figcaption></figure>`;
  if (p.visual === "text") return "";
  const artwork = {
    nmi: '<span class="visual-small">New Media Institute</span><span class="visual-type">A place<br>to <em>explore.</em></span><span class="visual-foot">Development / Design / Discovery</span>',
    scholarship:
      '<span class="visual-small">Scholarship navigation prototype</span><span class="visual-type">Opportunity,<br><em>within reach.</em></span><span class="visual-foot">Bank of America Code-A-Thon</span>',
    willow:
      '<span class="visual-small">Brand style guide + Figma prototypes</span><span class="visual-type serif-type">Willow<br>Street.</span><span class="visual-foot">Flower Shop / Project Triple Threat</span>',
    sigma:
      '<span class="visual-small">ΦΒΣ / Zeta Nu Chapter</span><span class="visual-type">Culture.<br>Community.<br><em>Connection.</em></span><span class="visual-foot">Presentation artwork · Samples forthcoming</span>',
    gdg: '<span class="visual-small">GDG / Tennessee State University</span><span class="visual-type mono-type">Build.<br>Connect.<br><em>Grow.</em></span><span class="visual-foot">Presentation artwork · Samples forthcoming</span>',
  };
  return `<figure class="project-visual type-visual visual-${p.visual}" role="img" aria-label="Editorial presentation artwork for ${p.title}${p.category === "graphic" ? "; approved work samples forthcoming" : ""}."><div aria-hidden="true">${artwork[p.visual]}</div></figure>`;
}
export function projectCard(p, index = 0, featured = false) {
  return `<article id="${p.id}" class="project-entry ${featured ? "featured-project" : ""} project-${p.visual}"><div class="project-overline"><span>${String(index + 1).padStart(2, "0")} / ${p.discipline}</span><span>${p.year || ""}</span></div>${visual(p)}<div class="project-copy"><div class="project-title-row"><h3><a href="${p.href}"${external(p.href)}>${p.title}${/^http/.test(p.href) ? '<span class="sr-only"> (opens in a new tab)</span>' : ""}</a></h3>${icon("external")}</div><p>${p.description}</p><p class="project-role"><span>${p.category === "graphic" && p.id === "gdg" ? "Discipline" : "Role / discipline"}</span> ${p.role}</p><div class="project-bottom"><ul class="tags" aria-label="Tools and disciplines">${p.tools.map((t) => `<li>${t}</li>`).join("")}</ul>${link(p.href, p.action)}</div></div></article>`;
}
export const externalSocialProjectCard = (p, i) => projectCard(p, i);
export function categoryControls() {
  return `<div class="work-controls" hidden><div class="filter-buttons" role="group" aria-label="Filter work by discipline"><button type="button" aria-pressed="true" data-filter="all">All Work <span>08</span></button>${categories.map((c) => `<button type="button" aria-pressed="false" data-filter="${c.id}">${c.title}</button>`).join("")}</div><p class="sr-only" id="filter-status" role="status" aria-live="polite"></p></div>`;
}
export function workCollection() {
  return `${categoryControls()}${categories
    .map(
      (c, i) =>
        `<section class="work-category" data-category="${c.id}" aria-labelledby="category-${c.id}"><div class="category-heading"><p class="eyebrow">0${i + 1} / Discipline</p><h2 id="category-${c.id}">${c.title}</h2><p>${c.note}</p></div><div class="project-grid">${projects
          .filter((p) => p.category === c.id)
          .map((p) =>
            p.category === "graphic"
              ? externalSocialProjectCard(p, projects.indexOf(p))
              : projectCard(p, projects.indexOf(p), p.featured),
          )
          .join("")}</div></section>`,
    )
    .join("")}`;
}
export function selectedWork() {
  return `<section id="work" class="selected-work section-wrap"><div class="section-heading"><p class="eyebrow">01 / Selected Work</p><a class="text-link" href="/work/">The full collection ${icon("right")}</a></div><div class="work-heading"><h2>Different disciplines.<br><em>One curious mind.</em></h2><p>From the systems behind an experience to the details that make it feel right.</p></div><div class="project-grid home-projects">${projectCard(projects[0], 0, true)}${projectCard(projects[1], 1)}${projectCard(projects[3], 3)}</div><div class="discipline-links">${categories.map((c) => `<a href="/work/#category-${c.id}"><span>${c.title}</span>${icon("external")}</a>`).join("")}</div></section>`;
}
