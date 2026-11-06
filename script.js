// Progressive enhancement only: content, links, and project categories work without JS.
const navigation = document.querySelector("#site-navigation");
const menuButton = document.querySelector(".menu-toggle");
const compact = window.matchMedia("(max-width: 700px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
function setMenu(open, restoreFocus = false) {
  if (!navigation || !menuButton) return;
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.hidden = compact.matches && !open;
  menuButton.querySelector("span").textContent = open ? "Close" : "Menu";
  if (restoreFocus) menuButton.focus();
}
function syncMenu() {
  if (!menuButton) return;
  menuButton.hidden = !compact.matches;
  setMenu(false);
}
syncMenu();
compact.addEventListener("change", syncMenu);
menuButton?.addEventListener("click", () =>
  setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
);
navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton?.getAttribute("aria-expanded") === "true"
  )
    setMenu(false, true);
});
const controls = document.querySelector(".work-controls");
if (controls) {
  controls.hidden = false;
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const filter = button.dataset.filter;
    controls
      .querySelectorAll("[data-filter]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    let count = 0;
    document.querySelectorAll("[data-category]").forEach((section) => {
      section.hidden = filter !== "all" && section.dataset.category !== filter;
      if (!section.hidden)
        count += section.querySelectorAll(".project-entry").length;
    });
    document.querySelector("#filter-status").textContent =
      `${count} projects shown. ${button.textContent.replace("08", "").trim()}.`;
  });
}
// A tiny canopy translation, bounded to 3px; no continuous motion loop.
const hero = document.querySelector(".hero");
if (hero && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener(
    "pointermove",
    (event) => {
      if (reducedMotion.matches) return;
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty(
        "--tree-x",
        `${((event.clientX - bounds.left) / bounds.width - 0.5) * 6}px`,
      );
      hero.style.setProperty(
        "--tree-y",
        `${((event.clientY - bounds.top) / bounds.height - 0.5) * 4}px`,
      );
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--tree-x", "0px");
    hero.style.setProperty("--tree-y", "0px");
  });
}
// React + StageShow load only when project media approaches the viewport.
const scenes = document.querySelectorAll("[data-scene]");
if (scenes.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        import("/assets/generated/scenes.js")
          .then((module) => module.mountScene(entry.target))
          .catch(() => {
            // The real screenshot remains a complete, useful poster if animation fails.
          });
      }
    },
    { rootMargin: "180px" },
  );
  scenes.forEach((scene) => observer.observe(scene));
}
