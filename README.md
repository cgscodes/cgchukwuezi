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
