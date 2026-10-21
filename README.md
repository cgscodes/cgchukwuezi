# Chigekwu Portfolio

Static portfolio using Tailwind CDN, custom CSS, and vanilla JavaScript. The main page retains its brown, cream, blue, and tan palette and rounded cards. Separate coursework lives under `nmi-portfolio/`.

## Local preview

From this repository, run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Internet access is needed for Tailwind and Google Fonts. There is no package manager, production build, formatter, linter, or test runner configured; the repository files are served directly. `CNAME` preserves the existing custom domain.

## Resume required before sharing

Place your current PDF at **`assets/Chigekwu-Chukwuezi-Resume.pdf`** (case-sensitive). Both Download Resume links use that location. No resume was present, and no replacement has been generated. Until supplied, the links cannot download a PDF and the contact section explains its availability. The notice hides automatically when the server returns a PDF at that path.

## Main files

- `index.html`: portfolio content, navigation, and metadata
- `styles.css`: existing visual identity and responsive/accessibility refinements
- `script.js`: keyboard-accessible mobile menu and resume availability check
- `assets/`: publicly served resume location
- `nmi-portfolio/`: existing NMI coursework and project pages

## Selected Work

`work/index.html` serves the dedicated project index. GitHub Pages redirects `/work` to `/work/` and serves the directory index, so direct visits and refreshes need no SPA fallback. Shared styling and mobile navigation come from `/styles.css` and `/script.js`; the index layout is scoped to `work/work.css`. The homepage links to this page without adding RackLab to its project selection.

Preview at `http://localhost:8000/work/` with the local server above. Optimized JPEGs in `assets/work/` include a screenshot of the deployed RackLab application and the supplied WAVE hallway photograph, each with a smaller responsive variant. Existing project descriptions and URLs are retained; only RackLab has a supplied project year. Supporting NMI links come from `nmi-portfolio/index.html`.
