# Portfolio redesign

## Before editing

- Clean working tree. No existing uncommitted changes.
- Static HTML, CSS and JavaScript; no framework, package scripts, linter, type checker or tests.
- Root page: hero, About, Experience, Core Skills, Education, Selected Work, Outside of Work and Contact. Anchor navigation; downloadable local résumé; mobile menu with Escape and focus trapping.
- `/work/`: RackLab, WAVE, Scholarship Access, NMI, Dossier and Project Triple Threat. Live RackLab screenshot and WAVE promotional still are reusable.
- `/nmi-portfolio/` contains a separate existing coursework collection, including a real playground and individual course projects. Preserved in place.
- Google Analytics ID `G-CWQ9KXW79R` on the original home page. Retained.
- GitHub Pages static source; `CNAME` is `cgchukwuezi.com`. No existing hosting workflow or build configuration. Both source and production output stay static.
- Original links and section content inventoried in `src/data/original-*.json` for regression checks.
- Baseline screenshots recorded under ignored `artifacts/` before changing the site UI. Mobile menu behavior checked in Chrome.

## Stages

1. Audit, baseline preview, content inventory and StageShow package/PDF inspection.
2. Reusable static-rendered components, tokens, hero and native SVG tree.
3. Categorized work index, selected projects, About/supporting content and selective StageShow.
4. Production build, links, accessibility, responsive and motion validation.

## Architecture

The website remains static and readable without JavaScript. Small template functions in `src/components/` generate committed HTML. `src/data/projects.mjs` holds verified project information. React is isolated to a lazy-loaded StageShow illustration; it does not run the site shell. Existing coursework routes retain their own styles/scripts.

Build with `npm ci && npm run build`. The build refreshes committed `index.html`, `work/index.html` and `assets/generated/`, and creates `dist/` containing the entire static website. GitHub Pages may continue serving the repository root, or serve `dist/` from a future build workflow. No domain or deployment migration is required.

## Content notes

- BookOrbit has no verified content in this repository and is not added.
- Graphic Design & PR presentation artwork is explicitly labeled as such; approved work samples are still needed. No Instagram content was scraped.
- Original metadata said May 2027 while Education said December 2027. Preserve Education's explicit date and avoid repeating either in new metadata; owner should confirm.
- Exact RackLab role and unspecified project dates need confirmation before expanding descriptions. Neutral discipline labels are used.
- Original NMI course project pages are preserved rather than altering the coursework itself. Their established routes, assets, and links stay available.

## Major file changes

- `index.html`: generated editorial home page, hero/tree, selected work, About, experience, skills, education, interests and contact.
- `work/index.html`: categorized eight-project index; accessible filters; real project media and external social entries.
- `nmi-portfolio/index.html`, `nmi-portfolio/webdev/index.html`, `nmi-portfolio/webdev/playground/index.html`: unified collection pages. Individual coursework sites retain their own designs. Corrected the original `/webdev/index.html` link to the actual collection route.
- `nmi-portfolio/webdev/project-four/index.html`: makes the original missing route resolve honestly; explicitly says materials are not available.
- `styles.css`: one shared token system, editorial layouts, responsive rules, focus styles, tree entrance and reduced-motion support. Replaces the old Tailwind-dependent stylesheet.
- `script.js`: navigation disclosure, keyboard Escape, work filtering, bounded pointer depth, and lazy scene loading. Core content does not depend on it.
- `src/components/shared.mjs`: shared document head, analytics, icons, navigation, headings, link helper and footer.
- `src/components/home.mjs`, `tree.mjs`, `projects.mjs`, `work.mjs`, `coursework.mjs`: reusable static template components.
- `src/data/projects.mjs`: verified project information and explicit notes for missing facts/assets. `original-content.json` and `original-links.json` retain the baseline inventory.
- `src/scenes/RackLab.tsx`, `racklab.css`, `kit/`: isolated StageShow presentation based on the supplied examples. Static on purpose; the artwork uses actual interface images and makes no simulated interaction claims. Kit license and notices retained. Source reference copies are included.
- `assets/fonts/`: locally hosted, subset WOFF2 fonts and licenses. Five families; approximately 141 KB of font files.
- `assets/work/chigekwu-portrait.jpg`, `racklab-detail.jpg`: optimized derivatives of existing images. Original files are preserved.
- `assets/generated/scenes.js`, `scenes.css`: committed browser-ready StageShow bundle so the existing root deployment continues to work.
- `scripts/build.mjs`: refreshes HTML and scene bundle and assembles the static `dist/` artifact, preserving `CNAME` and all course assets.
- `scripts/portfolio.test.mjs`, `browser-check.mjs`, `check-external.mjs`: regression, browser/accessibility and external reachability checks.
- `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`: reproducible build/verification tools. Build dependencies do not convert the static site into a client-rendered app.
- Removed `work/work.css`, `nmi-portfolio/styles.css`, and `nmi-portfolio/main.js` only after confirming the redesigned pages were their sole consumers.

The original résumé PDF, favicon, CNAME, project screenshots, course project files, and existing verified project facts remain intact. No commits, pushes, publication, Instagram content copying, or third-party account writes were performed.
