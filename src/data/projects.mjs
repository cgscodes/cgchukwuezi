// Facts come from the original portfolio. Unknown roles/dates are intentionally omitted.
// CONTENT NOTE: add approved screenshots, roles and dates when supplied; never infer them.
export const categories = [
  {
    id: "software",
    title: "Software & Development",
    note: "Interfaces, systems, and things that work.",
  },
  {
    id: "design",
    title: "UX & Product Design",
    note: "Making complex ideas easier to navigate.",
  },
  {
    id: "graphic",
    title: "Graphic Design & PR",
    note: "Visual stories. Shared connections.",
  },
];
export const projects = [
  {
    id: "racklab",
    title: "RackLab",
    category: "software",
    discipline: "Interactive 3D · Web application",
    year: "2026",
    description:
      "An interactive 3D server-rack configurator for arranging equipment while tracking rack capacity, placement conflicts, and estimated power use.",
    role: "Interactive 3D development",
    tools: ["React", "TypeScript", "React Three Fiber"],
    href: "https://cgscodes.github.io/RackLab/",
    action: "Open application",
    visual: "racklab",
    featured: true,
    // CONTENT NOTE: confirm the precise project role before expanding this neutral discipline label.
  },
  {
    id: "wave",
    title: "WAVE Ticketing Platform",
    category: "software",
    discipline: "Campus events · Frontend",
    description:
      "Campus-event ticketing platform serving more than 200 online users. Co-developed more than 40 responsive pages, mapped user flows, and tested the application for iOS deployment using HTML, CSS, Tailwind CSS, React, and Xcode.",
    role: "Frontend development · User flows · iOS testing",
    tools: ["React", "Tailwind CSS", "Xcode"],
    href: "https://github.com/WAVE-CAMPUS-LLC",
    action: "View on GitHub",
    visual: "wave",
    reel: "https://www.instagram.com/reel/DIewRCSsxNg/?cplk=MWE5cDRhNHhlN211bw==",
  },
  {
    id: "nmi",
    title: "NMI Portfolio",
    category: "software",
    discipline: "Web development · Coursework",
    description:
      "A New Media portfolio documenting web projects, case studies, and coursework from the New Media Institute.",
    role: "Web development · Design",
    tools: ["HTML", "CSS", "NMI"],
    href: "/nmi-portfolio/index.html",
    action: "Explore portfolio",
    visual: "nmi",
  },
  {
    id: "scholarship",
    title: "Scholarship Access Platform",
    category: "design",
    discipline: "Bank of America Code-A-Thon",
    description:
      "Bank of America Code-A-Thon prototype redesigning scholarship navigation to help students find and apply for financial aid more easily.",
    role: "Prototype · UX",
    tools: ["Prototyping", "AI Features", "UX"],
    href: "https://github.com/Edmund-ka/TSU-Scholarship",
    action: "View repository",
    visual: "scholarship",
  },
  {
    id: "triple-threat",
    title: "Project Triple Threat",
    category: "design",
    discipline: "NMI 4010 · Graphic design",
    description:
      "Brand style guide and Figma prototypes for Willow Street Flower Shop.",
    role: "Graphic design · Prototyping",
    tools: ["Brand design", "Figma"],
    href: "https://canva.link/fo5xr4aj1cvdyv4",
    action: "View project",
    visual: "willow",
  },
  {
    id: "dossier",
    title: "Dossier",
    category: "design",
    discipline: "New Media · Case study collection",
    description:
      "Case studies from NMI courses. Each entry covers goals, process, tools, and results.",
    role: "Case study documentation",
    tools: ["Research", "Process", "Reflection"],
    href: "https://medium.com/@chigekwuchukwuezi/list/new-media-case-study-collection-cbedcdafded3",
    action: "Read case studies",
    visual: "text",
  },
  {
    id: "sigma",
    title: "Phi Beta Sigma Fraternity, Incorporated, Zeta Nu Chapter",
    category: "graphic",
    discipline: "Public relations · Visual design",
    description:
      "Public relations, visual design, and digital content for the Zeta Nu Chapter of Phi Beta Sigma Fraternity, Incorporated.",
    role: "PR Chair",
    tools: ["Public relations", "Visual design", "Digital content"],
    href: "https://www.instagram.com/theugasigmas/?hl=en",
    action: "View Instagram",
    visual: "sigma",
    // CONTENT NOTE: typographic presentation only; replace with approved work samples. No post authorship implied.
  },
  {
    id: "gdg",
    title: "Google Developer Groups at Tennessee State University",
    category: "graphic",
    discipline: "Graphic Design & Community PR",
    description:
      "Visual communication and promotional design supporting the student developer community at Tennessee State University.",
    role: "Graphic Design & Community PR",
    tools: ["Visual communication", "Community"],
    href: "https://www.instagram.com/gdg_tsu/",
    action: "View Instagram",
    visual: "gdg",
    // CONTENT NOTE: no unverified title or dates. Replace the presentation with approved local samples.
  },
];
