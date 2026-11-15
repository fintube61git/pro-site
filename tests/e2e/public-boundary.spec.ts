import { expect, test } from "@playwright/test";

test("the public package excludes internal instructions backups and tooling", async ({ request }) => {
  test.skip(!process.env.SITE_ROOT && !process.env.SITE_BASE_URL, "Requires the packaged or deployed site");
  for (const path of [
    "/AGENTS.md", "/START_HERE.md", "/README.md", "/cv_raw_backup.md",
    "/docs/DOMAIN_AUTHORITY_MAP.md", "/docs/CV_UPDATE_WORKFLOW.md",
    "/docs/CV_WORKFLOW.md", "/docs/cv-workflow.md",
    "/docs/EXISTENZPSYCH_WEBFLOW_RETIREMENT.md", "/docs/WEBSITE_CHANGE_PROTOCOL.md",
    "/backup_html/index.html", "/backup_html/about.html", "/backup_html/apps.html",
    "/backup_html/apps.html.working", "/backup_html/404.html", "/backup_html/contact.html",
    "/backup_html/privacy.html", "/backup_html/services.html", "/backup_html/payments-insurance.html",
    "/tools/publish_cv.ps1", "/tools/build_public_site.py", "/public-files.json", "/.git/config",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("CV lists render expand and retain every entry for printing", async ({ page }) => {
  await page.goto("/cv/#publications");
  const publications = page.locator("#publications + ul > li");
  const presentations = page.locator("#presentations + ul > li");
  await expect(publications.first()).toBeVisible();
  expect(await publications.count()).toBeGreaterThan(5);
  expect(await presentations.count()).toBeGreaterThan(5);
  await expect(publications.nth(5)).toBeHidden();
  await page.getByRole("button", { name: "View complete publications list" }).click();
  await expect(publications.nth(5)).toBeVisible();
  await page.getByRole("button", { name: "Show only the five most recent" }).click();
  await expect(publications.nth(5)).toBeHidden();
  await page.emulateMedia({ media: "print" });
  await expect(publications.nth(5)).toBeVisible();
  await expect(presentations.nth(5)).toBeVisible();
});
