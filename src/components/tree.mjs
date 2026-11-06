// Five font roles: sans branches, condensed trunk, serif canopy, mono code, handwritten tips.
// Deterministic curved rows build a silhouette; no random positions or rotations.
export function typographicTree() {
  let defs = "",
    canopy = "",
    structure = "",
    trunk = "";
  const rows = [
    [86, 315, 450],
    [104, 268, 492],
    [123, 225, 538],
    [144, 188, 565],
    [164, 159, 600],
    [185, 132, 626],
    [205, 112, 648],
    [226, 99, 663],
    [248, 86, 674],
    [271, 90, 683],
    [294, 103, 678],
    [318, 117, 665],
    [340, 136, 643],
    [361, 158, 620],
    [382, 183, 595],
    [401, 220, 558],
  ];
  rows.forEach(([y, left, right], i) => {
    const length = right - left;
    const count = Math.floor(length / (i % 3 === 0 ? 58 : 49));
    const text = Array(count).fill("cgchuk").join("  ");
    defs += `<path id="canopy-${i}" d="M${left},${y} Q380,${y - 35} ${right},${y}"/>`;
    canopy += `<text class="tree-word tree-font-${i % 4}" style="--i:${i};font-size:${i % 3 === 0 ? 18 : 15}px" textLength="${length}" lengthAdjust="spacing"><textPath href="#canopy-${i}">${text}</textPath></text>`;
  });
  const branches = [
    "M378,490 Q332,390 161,276",
    "M382,450 Q290,351 136,205",
    "M384,438 Q346,290 264,149",
    "M385,422 Q388,234 386,102",
    "M391,452 Q444,310 537,166",
    "M391,464 Q519,355 649,254",
    "M391,488 Q501,402 626,347",
    "M376,476 Q285,411 159,355",
  ];
  branches.forEach((d, i) => {
    defs += `<path id="branch-${i}" d="${d}"/>`;
    structure += `<text class="tree-branch" style="--i:${i + 16};font-size:${i % 2 ? 21 : 25}px"><textPath href="#branch-${i}" textLength="245" lengthAdjust="spacingAndGlyphs">cgchuk cgchuk cgchuk</textPath></text>`;
  });
  for (let i = 0; i < 3; i++) {
    defs += `<path id="trunk-${i}" d="M${365 + i * 14},674 Q${382 + i * 4},584 ${373 + i * 13},395"/>`;
    trunk += `<text class="tree-trunk" style="--i:${i + 23};font-size:${i === 2 ? 25 : 19}px"><textPath href="#trunk-${i}">cgchuk cgchuk cgchuk cgchuk</textPath></text>`;
  }
  return `<figure class="tree-art" role="img" aria-label="A spreading tree composed of cgchuk in five styles of typography, connecting code, design, and creativity."><svg viewBox="0 0 760 740" aria-hidden="true" focusable="false"><defs>${defs}</defs><g class="tree-canopy">${canopy}</g><g class="tree-structure">${structure}</g><g class="tree-base">${trunk}<text x="299" y="687" class="tree-root">cgchuk</text><text x="398" y="689" class="tree-root">cgchuk</text></g><g class="tree-tips"><text x="90" y="175">cgchuk</text><text x="626" y="183">cgchuk</text><text x="669" y="347">cgchuk</text></g></svg><figcaption aria-hidden="true">A work in growth. <span>01 / cgchuk</span></figcaption></figure>`;
}
