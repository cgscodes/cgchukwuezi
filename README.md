# cgchuk portfolio

Personal portfolio of Chigekwu Chukwuezi: [cgchukwuezi.com](https://cgchukwuezi.com).

The site remains static HTML/CSS/JavaScript. Edit reusable templates in `src/components/` and project content in `src/data/projects.mjs` and design tokens in `tokens.css`, then run `npm run build` to refresh the committed pages, compiled `assets/generated/site.css`, and production `dist/` directory. React is used only for the lazily loaded StageShow project presentation.

```sh
npm ci
npm run build
npm run dev
```

Preview at `http://127.0.0.1:8000`. Existing GitHub Pages hosting from the repository root still works; `CNAME` is preserved.

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
node scripts/browser-check.mjs
node scripts/check-external.mjs
```

Browser verification uses an installed Chrome. Set `CHROME_PATH` if it is not at the default macOS location. Browser artifacts are written to ignored `artifacts/`.

See [the redesign audit and file summary](docs/REDESIGN.md), [verification results](docs/VERIFICATION.md), and [StageShow rehearsal notes](src/scenes/REHEARSAL.md).

The design refinement audit and before/after comparison are in [docs/REFINEMENT.md](docs/REFINEMENT.md). To use another preview port, set `PORTFOLIO_ORIGIN` when running the browser checks.

The navigation sun/moon button follows the device theme initially and remembers a manual light/dark choice. It is inside Menu on mobile. Verify with `node scripts/theme-check.mjs` (or set `PORTFOLIO_ORIGIN` for another preview port).
