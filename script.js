// Resolve before CSS in the document head; enhance the control here.
const deviceTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeButton = document.querySelector(".theme-toggle");
let savedTheme;
try {
  savedTheme = window.localStorage.getItem("cgchuk-theme");
} catch {
  /* Storage may be unavailable. */
}
function applyTheme(theme) {
  const dark = theme === "dark";
  const root = document.documentElement;
  if (root.dataset.theme !== theme) {
    // Switch surfaces and text atomically: interpolating between opposite
    // themes briefly produces unreadable gray-on-gray controls.
    root.classList.add("theme-changing");
    root.dataset.theme = theme;
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() =>
        root.classList.remove("theme-changing"),
      ),
    );
  }
  const action = dark ? "light" : "dark";
  themeButton?.setAttribute("aria-label", `Switch to ${action} mode`);
  themeButton?.setAttribute("title", `Switch to ${action} mode`);
  const label = themeButton?.querySelector(".theme-label");
  if (label) label.textContent = dark ? "Light mode" : "Dark mode";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#201c19" : "#AFC9D9");
}
applyTheme(
  document.documentElement.dataset.theme ||
    (deviceTheme.matches ? "dark" : "light"),
);
themeButton?.addEventListener("click", () => {
  savedTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(savedTheme);
  try {
    window.localStorage.setItem("cgchuk-theme", savedTheme);
  } catch {
    /* Keep the in-memory selection. */
  }
});
deviceTheme.addEventListener("change", () => {
  if (savedTheme !== "light" && savedTheme !== "dark")
    applyTheme(deviceTheme.matches ? "dark" : "light");
});
window.addEventListener("storage", (event) => {
  if (event.key === "cgchuk-theme" || event.key === null) {
    savedTheme = event.newValue;
    applyTheme(
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : deviceTheme.matches
          ? "dark"
          : "light",
    );
  }
});

// Progressive enhancement only: content, links, and project categories work without JS.
const navigation = document.querySelector("#site-navigation");
const menuButton = document.querySelector(".menu-toggle");
const compact = window.matchMedia("(max-width: 767px)");
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
  navigation?.classList.toggle("glass", compact.matches);
  navigation?.classList.toggle("glass-elevated", compact.matches);
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
document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".site-header") &&
    menuButton?.getAttribute("aria-expanded") === "true"
  )
    setMenu(false);
});
function syncLocationLink() {
  navigation?.querySelectorAll("a").forEach((anchor) => {
    if (anchor.getAttribute("aria-current") === "location")
      anchor.removeAttribute("aria-current");
    const target = new URL(anchor.href, window.location.origin);
    if (
      target.pathname === window.location.pathname &&
      target.hash &&
      target.hash === window.location.hash
    )
      anchor.setAttribute("aria-current", "location");
  });
}
syncLocationLink();
window.addEventListener("hashchange", syncLocationLink);
const controls = document.querySelector(".work-controls");
if (controls) {
  controls.hidden = false;
  const buttons = [...controls.querySelectorAll("[data-filter]")];
  const valid = buttons.map((button) => button.dataset.filter);
  function applyFilter(requested, updateURL = false) {
    const filter = valid.includes(requested) ? requested : "all";
    let count = 0;
    for (const button of buttons)
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === filter),
      );
    document.querySelectorAll("[data-category]").forEach((section) => {
      section.hidden = filter !== "all" && section.dataset.category !== filter;
      if (!section.hidden)
        count += section.querySelectorAll(".project-entry").length;
    });
    const selected = buttons.find((button) => button.dataset.filter === filter);
    document.querySelector("#filter-status").textContent =
      `${count} projects shown. ${selected.textContent.replace("08", "").trim()}.`;
    if (updateURL) {
      const url = new URL(window.location.href);
      if (filter === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", filter);
      const target = url.hash
        ? document.getElementById(url.hash.slice(1))
        : null;
      if (target?.closest("[data-category]")?.hidden) url.hash = "";
      window.history.pushState({}, "", url);
    }
  }
  applyFilter(new URL(window.location.href).searchParams.get("category"));
  controls.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) applyFilter(button.dataset.filter, true);
  });
  controls.addEventListener("keydown", (event) => {
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % buttons.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      buttons[next].focus();
      applyFilter(buttons[next].dataset.filter, true);
    }
  });
  window.addEventListener("popstate", () =>
    applyFilter(new URL(window.location.href).searchParams.get("category")),
  );
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
// Reveal genuinely delayed media once, only while visible. Cached/local media
// stays visible immediately; failed JS never hides an image or leaves a skeleton.
document
  .querySelectorAll(".project-visual img, .about-heading img")
  .forEach((image) => {
    if (image.complete) return;
    image.addEventListener(
      "load",
      () => {
        if (reducedMotion.matches) return;
        const bounds = image.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight)
          image.classList.add("media-ready");
      },
      { once: true },
    );
  });
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
