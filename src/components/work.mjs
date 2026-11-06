import { workCollection } from "./projects.mjs";
import { icon } from "./shared.mjs";
export function work() {
  return `<header id="top" class="work-intro section-wrap"><a class="text-link" href="/#work">${icon("right")} Back to portfolio</a><div class="section-heading"><p class="eyebrow">The project index</p><span class="small-note">Code / Design / Communication</span></div><h1>Work, in<br><em>many forms.</em></h1><div class="work-intro-bottom"><p>A collection of applications, interfaces, and visual stories.<br>Different ways of making an idea real.</p><span class="eyebrow">Selected projects / 01—08</span></div></header><div class="work-collection section-wrap">${workCollection()}</div>`;
}
