import { icon, link } from "./shared.mjs";
const base = "/nmi-portfolio/webdev/";
const entry = (title, description, href, label = "Explore") =>
  `<article class="course-entry"><div><h3>${title}</h3><p>${description}</p></div>${link(href, label)}</article>`;
const intro = (title, subtitle) =>
  `<header id="top" class="work-intro section-wrap"><span id="hero" aria-hidden="true"></span><a class="text-link" href="/work/#nmi">${icon("right")} Back to work</a><div class="section-heading"><p class="eyebrow">New Media Institute / UGA</p></div><h1>${title}</h1><p class="course-subtitle">${subtitle}</p></header>`;
export function nmi() {
  return (
    intro(
      "New media.<br><em>New possibilities.</em>",
      "New Media work from CG Chukwuezi, Computer Science major at UGA.",
    ) +
    `<section id="about" class="section-wrap course-about"><h2>About Me</h2><div><p>I am CG Chukwuezi, a Computer Science student and NMI student at UGA. I like building web projects, learning design systems, and exploring digital storytelling.</p><ul><li>Major: Computer Science</li><li>Year: Junior</li><li>Interests: Web dev, design, photography, basketball, music</li></ul>${link(base, "Web Dev")}${link("#projects", "View projects")}</div></section><section id="projects" class="section-wrap course-projects"><h2>Projects</h2>${entry("Web Dev", "Projects 1–3, and Playground", base, "View folder")}${entry("Dossier · Case Study Collection", "Case studies from NMI courses. Each entry covers goals, process, tools, and results.", "https://medium.com/@chigekwuchukwuezi/list/new-media-case-study-collection-cbedcdafded3", "View study")}${entry("Project Triple Threat · NMI 4010", "Graphic Design — Brand style guide and Figma prototypes for Willow Street Flower Shop.", "https://canva.link/fo5xr4aj1cvdyv4", "View project")}</section><aside class="course-contact section-wrap"><p>For NMI work or project questions, reach out by email.</p><a href="mailto:ccc18714@uga.edu">ccc18714@uga.edu</a></aside>`
  );
}
export function webdev() {
  return (
    intro(
      "Learning<br><em>by building.</em>",
      "Web Development / New Media Certificate student",
    ) +
    `<section class="section-wrap course-projects"><h2>Web Development</h2><p class="course-goal">Goal: I want to understand how to make websites in a structured manner. I've been learning how to make websites through YouTube and hands-on experience, but never a rubric, so I'm excited to learn!</p>${entry("Playground", "Practice, experiments, and exercises.", base + "playground/")}${[1, 2, 3, 4].map((n) => entry("Project " + ["", "One", "Two", "Three", "Four"][n], n === 4 ? "Project materials are not available yet." : "New Media web development coursework.", base + "project-" + ["", "one", "two", "three", "four"][n] + "/")).join("")}${entry("Final Project", "New Media web development coursework.", base + "final-project/")}</section>`
  );
}
export function playground() {
  const groups = [
    [
      "Project 1",
      [
        ["Fonts Practice", "font.html"],
        ["List Practice", "list.html"],
        ["Links Practice", "links.html"],
        ["Box Styles", "box-styles.html"],
        ["Penguins", "penguins.html"],
      ],
    ],
    [
      "Project 2",
      [
        ["Bootstrap Test", "bootstrap-test.html"],
        ["Responsive Optimization Exercise", "bootstrap-exercise/index.html"],
        ["Grid Test", "grid/grid-test.html"],
        ["Quick Wrap Theme Exercise", "theme-test/index.html"],
      ],
    ],
  ];
  return (
    intro(
      "Room<br><em>to play.</em>",
      "Playground Assignments / Web development experiments",
    ) +
    groups
      .map(
        ([title, items]) =>
          `<section class="section-wrap course-projects"><h2>${title}</h2>${items.map(([name, path]) => entry(name, "Web development exercise.", base + "playground/" + path)).join("")}</section>`,
      )
      .join("")
  );
}
export function missingCourse() {
  return (
    intro("Project Four", "Web Development / New Media Institute") +
    `<section class="section-wrap course-projects"><h2>Materials forthcoming.</h2><p class="course-goal">Project materials are not available yet.</p><!-- CONTENT NOTE: the original project-four link had no matching folder. Add the actual coursework here when supplied. -->${link(base, "Explore other coursework")}</section>`
  );
}
