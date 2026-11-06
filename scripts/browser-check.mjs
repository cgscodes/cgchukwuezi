import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const results = [];
const errors = [];
const pages = [
  "/",
  "/work/",
  "/nmi-portfolio/",
  "/nmi-portfolio/webdev/",
  "/nmi-portfolio/webdev/playground/",
];
for (const width of [1440, 834, 390, 320]) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of pages) {
    await page.goto("http://127.0.0.1:8000" + path, {
      waitUntil: "networkidle",
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    console.log(`Checking ${path} at ${width}px`);
    // Exercise native lazy loading by scrolling real image elements into view.
    // Element handles stay stable while the optional scene adds more images.
    for (const image of await page.locator("img").elementHandles()) {
      if (!(await image.isVisible())) continue;
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(async (el) => {
        el.loading = "eager";
        try {
          await el.decode();
        } catch {
          // Responsive source selection can invalidate an in-flight decode.
          await new Promise((resolve) => window.requestAnimationFrame(resolve));
          await el.decode();
        }
      });
    }
    if (await page.locator(".stage-host").count()) {
      await page.locator(".stage-host").scrollIntoViewIfNeeded();
      await page.locator(".ss-stage").waitFor();
      await page
        .locator(".racklab-visual")
        .screenshot({ path: `artifacts/racklab-${width}.png` });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert(!overflow, `${path} overflows at ${width}`);
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images.filter((image) => !image.naturalWidth).map((image) => image.src),
      );
    assert.deepEqual(broken, [], `Broken media ${path} at ${width}`);
    if (width === 1440 || width === 390) {
      const key =
        path === "/" ? "home" : path.replaceAll("/", "-").slice(1, -1);
      await page.screenshot({
        path: `artifacts/${key}-${width}.png`,
        fullPage: true,
      });
      if (path === "/")
        await page.screenshot({ path: `artifacts/hero-${width}.png` });
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      results.push({
        path,
        width,
        overflow,
        violations: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
    }
  }
  await context.close();
}
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:8000/");
await mobile.getByRole("button", { name: "Menu", exact: true }).click();
assert(await mobile.getByRole("navigation").isVisible());
await mobile.keyboard.press("Escape");
assert.equal(
  await mobile.locator(".menu-toggle").getAttribute("aria-expanded"),
  "false",
);
assert.equal(
  await mobile.evaluate(() => document.activeElement.className),
  "menu-toggle",
);
await mobile.getByRole("button", { name: "Menu", exact: true }).click();
await mobile
  .getByRole("navigation")
  .getByRole("link", { name: "About", exact: true })
  .click();
assert.equal(
  await mobile.locator(".menu-toggle").getAttribute("aria-expanded"),
  "false",
);
await mobile.goto("http://127.0.0.1:8000/work/");
for (const [filter, count] of [
  ["Graphic Design & PR", 2],
  ["UX & Product Design", 3],
  ["Software & Development", 3],
  ["All Work", 8],
]) {
  await mobile
    .getByRole("button", { name: filter, exact: filter !== "All Work" })
    .click();
  assert.equal(await mobile.locator(".project-entry:visible").count(), count);
}
await mobile.emulateMedia({ reducedMotion: "reduce" });
await mobile.goto("http://127.0.0.1:8000/");
assert.equal(
  await mobile
    .locator(".tree-word")
    .first()
    .evaluate((el) => window.getComputedStyle(el).animationName),
  "none",
);
await mobile.locator(".stage-host").scrollIntoViewIfNeeded();
await mobile.locator(".ss-stage").waitFor();
await mobile
  .locator(".racklab-visual")
  .screenshot({ path: "artifacts/racklab-reduced-motion.png" });
await mobile.setViewportSize({ width: 720, height: 1000 });
await mobile.goto("http://127.0.0.1:8000/");
assert(
  !(await mobile.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )),
  "200% desktop zoom layout",
);
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.addStyleTag({ content: "html {font-size:200% !important}" });
await mobile.waitForFunction(
  () => !document.querySelector(".menu-toggle").hidden,
);
await mobile.evaluate(() => document.fonts.ready);
assert(
  !(await mobile.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  )),
  "200% text sizing",
);
await mobile.close();
const nojs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 844 },
});
const staticPage = await nojs.newPage();
await staticPage.goto("http://127.0.0.1:8000/work/");
assert.equal(await staticPage.locator(".project-entry:visible").count(), 8);
assert(await staticPage.getByRole("navigation").isVisible());
await staticPage.screenshot({
  path: "artifacts/work-no-js.png",
  fullPage: true,
});
await nojs.close();
const failureContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const fallbackPage = await failureContext.newPage();
await fallbackPage.route("**/assets/generated/scenes.css", (route) =>
  route.abort(),
);
await fallbackPage.goto("http://127.0.0.1:8000/work/");
await fallbackPage.locator(".stage-host").scrollIntoViewIfNeeded();
await fallbackPage.waitForTimeout(400);
assert.equal(
  await fallbackPage.locator(".scene-mount").count(),
  0,
  "Scene CSS failure retains poster",
);
assert(await fallbackPage.locator(".scene-poster").isVisible());
await failureContext.close();
const keyboardContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const keyboardPage = await keyboardContext.newPage();
await keyboardPage.goto("http://127.0.0.1:8000/");
await keyboardPage.keyboard.press("Tab");
assert(
  await keyboardPage
    .locator(".skip-link")
    .evaluate((el) => document.activeElement === el),
);
assert.notEqual(
  await keyboardPage
    .locator(".skip-link")
    .evaluate((el) => window.getComputedStyle(el).outlineStyle),
  "none",
);
await keyboardPage.keyboard.press("Enter");
assert(
  await keyboardPage
    .locator("main")
    .evaluate((el) => document.activeElement === el),
);
await keyboardContext.close();
await writeFile(
  "artifacts/browser-results.json",
  JSON.stringify(
    {
      results,
      errors,
      checks: [
        "4 widths",
        "keyboard menu and Escape",
        "all filters",
        "reduced motion",
        "200% desktop layout",
        "200% text",
        "no JavaScript",
        "all images decoded",
      ],
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  JSON.stringify(
    {
      pagesChecked: pages.length,
      widths: [1440, 834, 390, 320],
      axeViolations: results.flatMap((r) => r.violations).length,
      errors,
      results: results.filter((r) => r.violations.length),
    },
    null,
    2,
  ),
);
assert.equal(errors.length, 0);
assert.equal(
  results.flatMap((r) => r.violations).length,
  0,
  "Accessibility violations; see artifacts/browser-results.json",
);
