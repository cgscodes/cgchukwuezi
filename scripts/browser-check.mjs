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
const previewOrigin = process.env.PORTFOLIO_ORIGIN || "http://127.0.0.1:8000";
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
    await page.goto(previewOrigin + path, {
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
        // decode() may reject during responsive source selection even when
        // the selected image subsequently completes; verify the displayed
        // element rather than treating that transient API result as failure.
        await el.decode().catch(() => {});
      });
      await page.waitForFunction(
        (el) => el.complete && el.naturalWidth > 0,
        image,
        { timeout: 10000 },
      );
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
await mobile.goto(previewOrigin + "/");
await mobile.getByRole("button", { name: "Menu", exact: true }).click();
assert(
  await mobile
    .getByRole("navigation", { name: "Primary navigation" })
    .isVisible(),
);
await mobile.keyboard.press("Escape");
assert.equal(
  await mobile.locator(".menu-toggle").getAttribute("aria-expanded"),
  "false",
);
assert.equal(
  await mobile.evaluate(() =>
    document.activeElement.classList.contains("menu-toggle"),
  ),
  true,
);
await mobile.getByRole("button", { name: "Menu", exact: true }).click();
await mobile
  .getByRole("navigation", { name: "Primary navigation" })
  .getByRole("link", { name: "About", exact: true })
  .click();
assert.equal(
  await mobile.locator(".menu-toggle").getAttribute("aria-expanded"),
  "false",
);
await mobile.goto(previewOrigin + "/work/");
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
await mobile.goto(previewOrigin + "/work/?category=graphic");
assert.equal(await mobile.locator(".project-entry:visible").count(), 2);
await mobile.reload();
assert.equal(await mobile.locator(".project-entry:visible").count(), 2);
await mobile
  .getByRole("button", { name: "Graphic Design & PR", exact: true })
  .focus();
await mobile.keyboard.press("Home");
assert.equal(await mobile.locator(".project-entry:visible").count(), 8);
assert(!new URL(mobile.url()).searchParams.has("category"));
await mobile.goBack();
assert.equal(await mobile.locator(".project-entry:visible").count(), 2);
await mobile.emulateMedia({ reducedMotion: "reduce" });
await mobile.goto(previewOrigin + "/");
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
await mobile.goto(previewOrigin + "/");
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
await staticPage.goto(previewOrigin + "/work/");
assert.equal(await staticPage.locator(".project-entry:visible").count(), 8);
assert(
  await staticPage
    .getByRole("navigation", { name: "Primary navigation" })
    .isVisible(),
);
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
await fallbackPage.goto(previewOrigin + "/work/");
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
await keyboardPage.goto(previewOrigin + "/");
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

const downloadContext = await browser.newContext({
  acceptDownloads: true,
  viewport: { width: 390, height: 844 },
});
const downloadPage = await downloadContext.newPage();
await downloadPage.goto(previewOrigin + "/");
const downloadEvent = downloadPage.waitForEvent("download");
await downloadPage
  .locator("footer")
  .getByRole("link", { name: "Download résumé" })
  .click();
const download = await downloadEvent;
assert.equal(download.suggestedFilename(), "chukwuezi_resume.pdf");
await download.saveAs("artifacts/downloaded-resume.pdf");
const { createHash } = await import("node:crypto");
const { readFile } = await import("node:fs/promises");
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(
  digest(await readFile("artifacts/downloaded-resume.pdf")),
  digest(await readFile("assets/chukwuezi_resume.pdf")),
);
await downloadContext.close();
// Remove @supports blocks to exercise the opaque baseline, not merely hide blur.
const fallbackContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const glassPage = await fallbackContext.newPage();
await glassPage.route("**/assets/generated/site.css", async (route) => {
  const response = await route.fetch();
  const css = (await response.text()).replace(
    /@supports[^{}]*\{(?:[^{}]|\{[^{}]*\})*\}/g,
    "",
  );
  await route.fulfill({ response, body: css });
});
await glassPage.goto(previewOrigin + "/work/");
assert.equal(
  await glassPage
    .locator(".site-header")
    .evaluate((el) => window.getComputedStyle(el).backdropFilter),
  "none",
);
assert.equal(
  await glassPage
    .locator(".site-header")
    .evaluate((el) => window.getComputedStyle(el).backgroundColor),
  "rgb(244, 239, 231)",
);
await glassPage.getByRole("button", { name: "Menu", exact: true }).click();
assert(
  await glassPage
    .getByRole("navigation", { name: "Primary navigation" })
    .isVisible(),
);
await glassPage.screenshot({ path: "artifacts/glass-fallback.png" });
await fallbackContext.close();
const contrastContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const contrastPage = await contrastContext.newPage();
const contrastSession = await contrastContext.newCDPSession(contrastPage);
await contrastSession.send("Emulation.setEmulatedMedia", {
  features: [
    { name: "prefers-reduced-transparency", value: "reduce" },
    { name: "prefers-contrast", value: "more" },
  ],
});
await contrastPage.goto(previewOrigin + "/");
assert(
  await contrastPage.evaluate(
    () => window.matchMedia("(prefers-contrast: more)").matches,
  ),
);
assert.equal(
  await contrastPage
    .locator(".site-header")
    .evaluate((el) => window.getComputedStyle(el).backdropFilter),
  "none",
);
await contrastContext.close();

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
