# Verification — design-system refinement

## Scope

The existing overhaul was audited and refined in place. The working tree was clean before editing. Compare `docs/REFINEMENT.md` for the initial findings, token contract, before/after table and changed files. No framework, route, analytics or hosting migration was performed.

## Checks

Final result: formatter, lint, types, build and all six regression tests pass. The responsive suite reports zero axe violations and zero JavaScript errors. Targeted final checks also pass for stable menu sizing/close-icon state, 320px at 200% text, custom 404, delayed-image reveal and its reduced-motion fallback.

- Formatter, ESLint, TypeScript, six regression tests and production build.
- Chrome at 1440, 834, 390 and 320px: Home, Work, NMI, Web Development and Playground. Twenty page/viewport combinations, with axe WCAG 2/2.1 A/AA scans at desktop/mobile.
- Visible media decoding, no horizontal overflow, keyboard menu/Escape/focus restoration and skip link.
- Every Work filter; query-state restoration on reload; keyboard Home/arrows; browser Back restoration.
- Reduced motion; 200% desktop layout and 200% text; no-JavaScript content/navigation.
- An opaque fallback test removes the backdrop-filter support block and checks readable navigation and functioning menu. Increased-contrast/reduced-transparency handling is checked in Chrome emulation.
- Optional StageShow stylesheet failure retains the real poster. The existing static scene passes its supplied desktop/390px `--still --gate` checks; there is no application loop or cursor animation to claim as tested.
- A real browser download verifies the name `chukwuezi_resume.pdf` and compares its bytes with the original local PDF. Git baseline SHA-256 also matches exactly.
- Original destination/anchor preservation, safe external tabs, all project/category information, analytics ID, CNAME, résumé and coursework assets are covered by regression checks.
- Open Graph asset is a real 1200×630 PNG; canonical/meta/favicons remain present. `404.html` ships with noindex and usable navigation. GitHub Pages serves this file for unknown routes; the simple Python preview can show it directly at `/404.html`.

## Performance

Sequential mobile Lighthouse runs using the same local Chrome setup:

| Metric | Existing overhaul | Refinement |
| --- | --- | --- |
| Performance | 96 | 98 |
| First Contentful Paint | 1.2 s | 1.1 s |
| Largest Contentful Paint | 2.7 s | 2.5 s |
| Total Blocking Time | 40 ms | 60 ms |
| Cumulative Layout Shift | 0.012 | 0 |

These are local lab measurements, not production guarantees. The initial refinement exposed a font-loading shift; critical font preloads and a single minified stylesheet removed it. `styles.css`, font declarations and `tokens.css` are compiled to committed `assets/generated/site.css`, eliminating the runtime CSS import waterfall. Font/media assets remain local and project media remains lazy loaded. No analytics were disabled for the performance measurements.

Evidence: ignored `artifacts/refinement-lighthouse-before.json` and `refinement-lighthouse-after-optimized.json`. The prior overhaul is preserved from Git in an ignored baseline directory for the comparison, not shipped in production.

## Links and content

All 18 unique external portfolio/collection destinations were checked without copying profile content. Apple Music, Substack, both PR Instagram profiles, WAVE's existing reel, GitHub/project repositories, UGA, NMI, the chapter site and Goodreads returned HTTP 200. The Google developer-community URL redirects successfully. LinkedIn (999), Letterboxd, Medium and Canva (403) restrict automated verification; those original destinations remain intact.

Approved local samples for PR are still missing, so those entries use real organization names, roles, descriptions and links in text-led layouts. Personal Instagram/Facebook URLs were not verified and are omitted. Existing Goodreads/Letterboxd content remains alongside the requested new profiles. No listening history, article titles, campaign authorship, dates or metrics were invented.

Owner input still needed: personal Instagram/Facebook destinations; approved PR samples; Project Four materials; the previously reported graduation-date discrepancy and any precise project role/date confirmations. BookOrbit remains unverified in this repository and is not added.

## Limits and deployment

Physical devices and Safari/Firefox were not tested. Axe and Chrome emulation supplement the visual/keyboard checks; they are not a complete WCAG certification. The in-app browser connection failed before opening a page, so local Chrome was used.

`npm run build` refreshes root HTML/generated assets and assembles a complete static `dist/` including tokens, OG PNG and custom 404. `CNAME` remains `cgchukwuezi.com`. Existing repository-root GitHub Pages deployment continues to work. No debug/test routes or `artifacts/` files are included in the production output. No deployment, commit, push or external account write was performed.

## Navigation theme toggle

The portfolio now follows the device color scheme on first visit. The sun/moon navigation button switches to the opposite mode and stores the explicit choice under `cgchuk-theme`; mobile users access it in Menu. The preference applies before CSS paints and persists across portfolio routes/reloads. System changes are followed until a manual choice is made. Blocked storage still permits an in-page selection.

`scripts/theme-check.mjs` passes for both system schemes at 1440, 390 and 320px on Home and Work, including keyboard activation, persistence, live system changes, blocked storage, overflow and twelve axe scans with zero violations. Theme changes update text and surfaces atomically to avoid low-contrast intermediate colors. Project screenshots and StageShow's actual interface remain unchanged.
