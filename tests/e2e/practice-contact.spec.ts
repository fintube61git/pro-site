import { expect, test } from "@playwright/test";

test("practice contact routes consultation requests to Psychology Today", async ({ page }) => {
  await page.goto("/practice/contact.html");

  const requestConsultation = page.getByRole("link", { name: "Request consultation" });
  await expect(requestConsultation).toBeVisible();
  await expect(requestConsultation).toHaveAttribute(
    "href",
    "https://www.psychologytoday.com/us/therapists/t-dawson-woodrum-eugene-or/944087",
  );
  await expect(requestConsultation).toHaveAttribute("target", "_blank");
  await expect(requestConsultation).toHaveAttribute("rel", /noopener/);
});

test("practice home routes to contact page with PT consultation link", async ({ page }) => {
  await page.goto("/practice/index.html");

  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/practice\/contact\.html$/);

  const requestConsultation = page.getByRole("link", { name: "Request consultation" });
  await expect(requestConsultation).toHaveAttribute(
    "href",
    "https://www.psychologytoday.com/us/therapists/t-dawson-woodrum-eugene-or/944087",
  );
});

test("professional contact remains separate from practice PT contact flow", async ({ page }) => {
  await page.goto("/contact.html");

  const requestConsultation = page.getByRole("link", { name: "Request consultation" });
  await expect(requestConsultation).toBeVisible();
  await expect(requestConsultation).toHaveAttribute("href", "https://hushforms.com/existenzpsych");
});
