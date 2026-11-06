# RackLab StageShow rehearsal

## Plan and scope

A static project presentation in the portfolio's featured-work slot. Focal object: the real 18U rack in the existing interface screenshot. Payoff: visitors understand that RackLab is a server-rack configurator, then use the separate Open application link. No fictional equipment changes, power calculations, cursor, or application behavior is simulated.

Starting points: supplied StageShow `examples/static-card` (dominant cropped Window, fixed chrome, compact variant) and `examples/fade-crop` (product window framing). The static-card source and CSS are retained as reference text beside this component. The real screenshot replaces its fictional rows and satellite. The kit supplies Stage and Window geometry; the portfolio supplies its beige ground and brown/blue/moss tokens.

## Captures

- Desktop Stage design: 1120 × 700, filling the featured slot; actual host checked at 1440 and 834 viewport widths.
- Compact Stage: 358 × 340 below 600px host width; checked at 390 and 320 viewports.
- Desktop uses the complete real interface width, bleeding below the stage through nonessential footer space; the entire focal rack is visible.
- Compact uses an honest crop of the actual equipment viewport, with the full rack and no cropped text. It does not pretend that the application has a new mobile interface.
- Light warm palette only. No other looks shipped.
- A static poster is the shipped scene; there is no loop, cursor, playback control or animated application state to rehearse.
- The host retains a complete responsive image when JavaScript, bundle, or scene stylesheet loading fails.

## Checks

The supplied `film.mjs --still --gate` reports **rehearsal passed** at desktop and 390. It explicitly does not judge motion for these still captures. No motion pass is claimed. The unmodified static-card gold was also rendered for comparison; its broad kit import caused unrelated phone-geometry warnings in its own gate, not in this scene (which imports only the parts used).

Independent fresh-eye review identified duplicate fallback imagery behind the mounted scene and a cropped rack bottom. Both were corrected. Review of the updated desktop and compact frames returned no remaining findings. Reduced-motion and no-JavaScript fallback were checked in Chrome. CSS failure fallback was checked separately.

Ignored local evidence: `artifacts/gold-desktop.png`, `racklab-gate-desktop.png`, `racklab-gate-mobile.png`, the matching JSON gate reports, `racklab-1440.png`, `racklab-390.png`, and `racklab-reduced-motion.png`.

## Limits

No physical-device or Safari/Firefox test was performed. The preview and checks use installed desktop Chrome with responsive and reduced-motion emulation. Screenshot content is media, not an interactive embedded application; visitors follow the explicit live application link to use RackLab.

## Design-system refinement

The real interface and StageShow layout remain intact. The surrounding portfolio media now uses the shared 32px exterior and 16px interior radii (24/10px compact). Product chrome keeps its verified native dimensions; no portfolio glass is applied inside it. The supplied static gate passes again at desktop and 390px. A fresh independent review of `artifacts/refined-racklab-desktop.png` and `refined-racklab-mobile.png` found no focal-object cropping, duplicate fallback imagery or important clipped content. These remain static-frame claims, not animation-loop claims.
