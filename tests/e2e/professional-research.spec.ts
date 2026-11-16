import { expect, test } from "@playwright/test";

test("research navigation, sections, and professional links work", async ({ page }) => {
  await page.goto("/index.html");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  if (await menu.isVisible()) await menu.click();
  await page.getByLabel("Primary", { exact: true }).getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/research\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Human Agency, Control, and Possibility");
  await expect(page.locator('#nav-menu a[href="research.html"]')).toHaveAttribute("aria-current", "page");
  await page.getByLabel("On this page").getByRole("link", { name: "Agency-Space Theory", exact: true }).click();
  await expect(page.locator("#agency-space")).toBeInViewport();
  await expect(page.getByRole("link", { name: "Read the public Agency-Space Theory preprint on PsyArXiv" })).toHaveAttribute("href", "https://doi.org/10.31234/osf.io/hjwp3_v1");
  await page.getByRole("link", { name: "Fielding study below", exact: true }).click();
  await expect(page).toHaveURL(/#fielding-project$/);
  await expect(page.locator("#fielding-project")).toBeInViewport();
  await expect(page.locator('section[aria-labelledby="fielding-project"]')).toContainText("The survey is planned research.");
  await page.getByRole("link", { name: "contact me professionally" }).click();
  await expect(page).toHaveURL(/contact\.html$/);
  await expect(page.getByRole("link", { name: "Existenz Psych (existenzpsych.com)", exact: true })).toHaveAttribute("href", "https://existenzpsych.com/");
});

test("professional pages preserve the single clinical-link boundary", async ({ page }, testInfo) => {
  for (const route of ["/", "/about.html", "/research.html", "/apps.html", "/contact.html", "/privacy.html", "/cv/", "/resume/"]) {
    await page.goto(route);
    await expect(page.locator("main").getByRole("heading").first()).toBeVisible();
    const clinical = page.locator('a[href*="practice/"],a[href*="psychologytoday.com"],a[href*="existenzpsych.com"],a[href*="hushforms.com"]');
    await expect(clinical).toHaveCount(route === "/contact.html" ? 1 : 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (route === "/research.html" || route === "/contact.html" || route === "/") {
      const decline = page.getByRole("button", { name: "Decline analytics", exact: true });
      if (await decline.isVisible()) await decline.click();
      const label = route === "/" ? "home" : route.slice(1, -5);
      await page.screenshot({ path: testInfo.outputPath(`${label}.png`), fullPage: true });
      if (route === "/") {
        await page.locator('[aria-label="Selected research and tools"]').screenshot({ path: testInfo.outputPath("selected-work.png") });
      }
    }
  }
});

test("research analytics follow the existing consent choice", async ({ page }) => {
  let requests = 0;
  await page.route("https://www.googletagmanager.com/**", async route => {
    requests++;
    await route.fulfill({ contentType: "application/javascript", body: "/* intercepted */" });
  });
  await page.goto("/research.html");
  await expect(page.getByRole("region", { name: "Website analytics choices" })).toBeVisible();
  expect(requests).toBe(0);
  await page.getByRole("button", { name: "Decline analytics", exact: true }).click();
  await page.reload();
  await expect(page.getByRole("region", { name: "Website analytics choices" })).toBeHidden();
  expect(requests).toBe(0);
  await page.getByRole("button", { name: "Analytics choices", exact: true }).click();
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  await expect.poll(() => requests).toBe(1);
});


test("revised SSRN preprint and separate proposed survey are discoverable", async ({ page }) => {
  const doi = "https://doi.org/10.2139/ssrn.7405538";
  const title = "Unsolicited scholarly invitations to mental health clinicians and researchers";
  for (const route of ["/about.html", "/cv/", "/resume/"]) {
    await page.goto(route);
    await expect(page.locator("main")).toContainText(new RegExp(title, "i"));
    await expect(page.locator(`main a[href="${doi}"]`)).toHaveCount(1);
    await expect(page.locator("main")).not.toContainText("Platform-Era");
  }
  await page.goto("/");
  const cards = page.getByLabel("Selected research and tools").locator("article");
  await expect(cards).toHaveCount(4);
  await expect(cards.first()).toContainText("Agency-Space Theory");
  await cards.last().getByRole("link").click();
  await expect(page).toHaveURL(/research\.html#scholarly-invitations$/);
  await expect(page.locator("#scholarly-invitations")).toBeInViewport();
  const survey = page.locator('section[aria-labelledby="scholarly-invitations"]');
  await expect(survey).toContainText("one-time U.S. survey of recalled experience");
  await expect(survey).toContainText("separate developing project");
  await expect(survey).toContainText("no participant findings are reported");
  await expect(survey.locator(`a[href="${doi}"]`)).toHaveCount(1);
  await expect(page.locator('section[aria-labelledby="fielding-project"]')).not.toContainText("scholarly invitations");
  await page.getByLabel("On this page").getByRole("link", { name: "Unsolicited Scholarly Invitations", exact: true }).click();
  await expect(page.locator("#scholarly-invitations")).toBeInViewport();
});


test("404 assets and recovery navigation work at a nested missing URL", async ({ page, request }) => {
  // Python's preview server has its own error body; serve the site's 404 template
  // at a missing path to reproduce GitHub Pages' custom-error behavior.
  const template = await request.get("/404.html");
  await page.route("**/missing-audit/nested-page", async route => route.fulfill({
    status: 404, contentType: "text/html", body: await template.text(),
  }));
  const response = await page.goto("/missing-audit/nested-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("404 — Page Not Found");
  await expect(page.locator("link[rel=stylesheet]")).toHaveAttribute("href", "/css/styles.v2.css");
  expect((await request.get("/css/styles.v2.css")).ok()).toBe(true);
  await expect(page.locator(".brand")).toHaveText("T. Dawson Woodrum, PhD, JD");
  await expect(page.locator('[aria-current="page"]')).toHaveCount(0);
  await page.getByRole("link", { name: "Go to Home", exact: true }).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Interdisciplinary Empirical Researcher");
});

test("Apps loads one responsive WebP hero with its accessible description", async ({ page }) => {
  const images: string[] = [];
  page.on("request", request => {
    if (request.url().includes("apps-tools-hero")) images.push(request.url());
  });
  await page.goto("/apps.html");
  const hero = page.locator(".app-hero img");
  await expect(hero).toHaveAttribute("alt", /notebook and tablet/);
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const selected = await hero.evaluate((img: HTMLImageElement) => img.currentSrc);
  expect(selected).toMatch(/apps-tools-hero-(480|960|1536)\.webp$/);
  expect(images).toEqual([selected]);
});
