import { expect, test } from "@playwright/test";
import fs from "node:fs";

test.describe("application submission exports", () => {
  test("resume renders and can be exported to PDF from the browser", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Browser PDF export is only supported in Chromium.",
    );

    await page.goto("/resume/");
    await expect(page.getByRole("button", { name: "Print resume" })).toBeVisible();
    await expect(page.locator("#resume-content")).toContainText("T. Dawson Woodrum");
    await expect(page.locator("#resume-content")).toContainText(/human evaluation/i);

    const pdfPath = testInfo.outputPath("T_Dawson_Woodrum_Resume_test-export.pdf");
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
    });

    expect(fs.statSync(pdfPath).size).toBeGreaterThan(10_000);
  });

  test("cv renders full browser-native content and can be exported to PDF", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Browser PDF export is only supported in Chromium.",
    );

    await page.goto("/cv/#cv");
    await expect(page.locator("#cv-content")).toContainText("T. Dawson Woodrum");
    await expect(page.locator("#cv-content")).not.toContainText("Do NOT run pandoc");
    await expect(page.locator("#publications")).toBeVisible();
    await expect(page.locator("#presentations")).toBeVisible();

    const pdfPath = testInfo.outputPath("T_Dawson_Woodrum_CV_test-export.pdf");
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
    });

    expect(fs.statSync(pdfPath).size).toBeGreaterThan(10_000);
  });
});
