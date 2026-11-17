import { expect, test } from "@playwright/test";

const title = "Group Membership and People's Sense of Their Own Choices";
const paragraphs = [
  "A research study by T. Dawson Woodrum, PhD, JD, Institute for Social Innovation Fellow, Fielding Graduate University.",
  "If you took part in this study, thank you.",
  "A summary of the results will be posted on this page after the whole study has ended. That may be many months from now.",
  "This page has no form and asks you for nothing.",
  "Questions: dawson@tdawsonwoodrum.com",
];

for (const savedConsent of [false, true]) {
  test(`study results preserve exact text and make no resource requests (saved consent: ${savedConsent})`, async ({ page, context }) => {
    if (savedConsent) {
      await page.addInitScript(() => localStorage.setItem("site-analytics-consent", "allowed"));
    }
    const requests: string[] = [];
    const errors: string[] = [];
    page.on("request", request => requests.push(request.url()));
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto("/study-results.html", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    expect(response?.headers()["set-cookie"]).toBeUndefined();
    await expect(page).toHaveTitle(title);
    await expect(page.locator("main h1")).toHaveText(title);
    expect(await page.locator("main p").allTextContents()).toEqual(paragraphs);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
    expect(await page.locator("script, form, input, textarea, iframe, img, video, audio, object, embed, button").count()).toBe(0);
    expect(await page.locator('link[rel="stylesheet"], link[rel="preload"], link[rel="preconnect"]').count()).toBe(0);
    expect(await context.cookies()).toEqual([]);
    expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(savedConsent ? ["site-analytics-consent"] : []);
    expect(requests).toEqual([page.url()]);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator("main p").first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(18);
    await expect(page.getByRole("link", { name: "Privacy Policy", exact: true })).toBeVisible();
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(11, 15, 20)");
  });
}

test("study results are absent from other pages and the sitemap", async ({ request }) => {
  for (const path of ["/", "/about.html", "/research.html", "/apps.html", "/contact.html", "/privacy.html", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    expect(await response.text()).not.toContain("study-results.html");
  }
});
