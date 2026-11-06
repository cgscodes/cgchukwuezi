# Design-system refinement

## Audit before editing

The working tree was clean. The static template/build structure, project data, domain, analytics and résumé were inspected before changes. Current Home and Work pages were run in Chrome at 1440, 834 and 390px; baseline captures and computed-style evidence are in ignored `artifacts/refinement-before/`.

Findings:

- Spacing mixed viewport units, fractional rems and late overrides instead of a stable rhythm. The same section and control roles had different insets.
- Type sizes were selected per component; metadata frequently fell below 12px. Serif, sans and monospace treatments appeared in interface/project typography without clearly assigned roles.
- The full-width fixed navigation competed with the hero; active states were limited. Mobile navigation worked as a disclosure but lacked a defined surface hierarchy.
- Primary actions used oversized pills and moved vertically on hover. Borders, image frames and corners did not share a radius system.
- The tree retained its identity, but its mobile version simply shrank the detailed desktop composition. Its small vertical caption and repeated forest copy added visual noise.
- Work categories and static StageShow presentation worked. Filter state did not survive a URL reload or browser history. Some project metadata was too faint/small relative to body copy.
- The footer repeated the same link treatment as project actions and lacked a consolidated personal social group. No verified personal Instagram or Facebook URL exists; organization Instagram accounts belong to the PR work, not personal profiles.
- Existing résumé file and download links were present and functional. No dedicated Open Graph image or custom 404 existed.

## Token contract established before component changes

Spacing: 4px for micro adjustments; 8, 16, 24, 32, 48, 64, 80, 96 and 128px for layout. Zero resets are allowed. Media dimensions, SVG artwork geometry, typography tracking, thin borders, 44px minimum touch targets, and optical focus rings are documented exceptions; they are not layout spacing.

Grid: 12 desktop columns (>=1200px), 8 tablet columns (768–1199px), 4 mobile columns (<768px). One 1440px maximum container; gutters are 80/48/24px; column gaps are 32/24/16px.

Typography: Instrument Serif for headings and its italic accent, Inter for body/UI. The tree alone retains its five assigned font roles. Display, H1, H2, H3, body large, body, small, label and metadata are shared roles. Body copy is capped at 65ch.

Geometry: 10px small controls, 16px controls/media interiors, 24px major surfaces, 32px hero/feature exteriors; 999px only for tags, filters and status/compact controls. Nested frames use smaller internal radii.

Glass: three shared levels using cream/blue/beige tints, consistent brown borders and brown shadows. Opaque fallbacks are the baseline; blur is progressive enhancement. Increased contrast and reduced transparency restore opaque surfaces. No glass is added to project interfaces or long body text.

Motion: shared fast, standard, entrance and scene durations; one easing curve. Hover never translates or resizes controls. Reduced motion completes the tree immediately. The existing StageShow scene remains an honest static presentation.

## Before / after

| Area | Previous implementation | Refined behavior |
| --- | --- | --- |
| Rhythm | Fractional rem/vw spacing and appended corrections | One explicit spacing scale and responsive container/grid |
| Type | Many component sizes, very small metadata, mixed interface styles | Nine type roles; Instrument Serif headings/italic and Inter body/UI; metadata at 12px minimum |
| Hero | Full-width navigation bar; dense scaled tree; outlined headline treatment | Inset glass navigation, curved blue frame, grid-aligned headline/name, less detailed compact tree, quiet supporting chip |
| Geometry | Sharp media, tiny corners, pill CTAs | 10/16/24/32px nested-radius system; standard 48px controls; pills reserved for status/compact uses |
| Motion | Buttons translated upward on hover | Feedback uses color, borders and restrained elevation; no hover movement |
| Work | Small metadata; filter state lost on refresh | Shared metadata rhythm, larger labels, query state, history and arrow/Home/End keyboard navigation |
| Graphic Design & PR | Generic typographic mock artwork without approved samples | Text-led organization/role/description/action entries; both original Instagram links retained |
| StageShow | Honest static interface with isolated lazy bundle | Same accurate interface, with curved portfolio framing; no glass or fabricated interactions inside the simulated product |
| Outside of Work | Reading and films only | Two editorial entries for Apple Music and Substack; reading and films preserved as quieter links |
| Contact | Repeated ordinary link row | Single social group for verified LinkedIn/GitHub, subtle glass contact strip and unchanged résumé file/download |
| Technical | No OG asset or custom 404 | Native 1200×630 social preview, OG/card metadata, accessible noindex 404 and unchanged static deployment |

## Files

- `tokens.css`: semantic palette, spacing, grid, typography, radius, elevation and motion contract.
- `styles.css`: replaces the previous stylesheet with a single coherent implementation; no second active style system.
- `src/components/shared.mjs`: glass navigation, active states, shared interactions/social group, footer and metadata.
- `src/components/home.mjs`, `tree.mjs`, `interests.mjs`: intrinsic hero composition, simplified compact tree and editorial interests section. Portrait dimensions now match the actual 640×640 asset.
- `src/components/projects.mjs`: curved/shared project presentation, text-led PR entries and category links carrying URL state.
- `src/data/profiles.mjs`: supplied music/writing URLs, verified personal social URLs and unchanged résumé destination. Existing `projects.mjs` data is unchanged.
- `script.js`: navigation disclosure/outside click, URL-aware current location, persistent Work filters and keyboard selection; existing tree and scene enhancement retained.
- `src/components/not-found.mjs`, `404.html`: custom GitHub Pages not-found experience.
- `scripts/social-preview.mjs`, `assets/social-preview.png`: reproducible native typography/tree social image; no stock art or invented work.
- `scripts/build.mjs`: includes tokens, 404 and new assets in the static artifact. Root and collection HTML are regenerated from their established templates.
- `scripts/browser-check.mjs`, `portfolio.test.mjs`: regression, real download, filter history, no-backdrop fallback and accessibility checks.
- `package.json`, `eslint.config.mjs`: formatter scope expanded; no new runtime dependencies or framework change.

No project facts, CNAME, résumé bytes, analytics ID, course project files or existing functional destinations were replaced. The tree's artwork coordinates and StageShow's actual product geometry remain intentional exceptions to interface tokens. No publication or remote writes were performed.

## Content still needed

Personal Instagram and Facebook URLs were not found in verified repository content and are intentionally absent from the personal social group. The chapter and GDG Instagram destinations remain attached to the correct PR work. Approved PR samples, Project Four materials, the previously noted graduation-date discrepancy, and any precise project role/date confirmations remain owner-supplied content needs. No usernames, campaigns, article titles, listening activity or metrics were invented.

## Validation and performance

See `VERIFICATION.md` for the final check results and limits. Sequential local mobile Lighthouse runs improved from 96 to 98; CLS improved from 0.012 to 0. Critical heading/body font preloads and the compiled `assets/generated/site.css` remove the initial font-loading shift and CSS import waterfall. The original analytical measurement tag remains enabled.
