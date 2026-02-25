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

test("professional contact is email-only and non-clinical", async ({ page }) => {
  await page.goto("/contact.html");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Contact");
  await expect(page.getByRole("link", { name: "dawson@tdawsonwoodrum.com" })).toHaveAttribute(
    "href",
    "mailto:dawson@tdawsonwoodrum.com",
  );
  await expect(page.getByText("AI in Clinical Practice")).toBeVisible();
  await expect(page.getByText("Development of Online Practice Tools")).toBeVisible();
  await expect(page.getByText("Speaking and Training")).toBeVisible();
  await expect(page.getByText("Scheduling")).toHaveCount(0);
  await expect(page.getByText("Private pay")).toHaveCount(0);
  await expect(page.getByText("Insurance (Neuvoa Counseling)")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Request consultation" })).toHaveCount(0);
});
