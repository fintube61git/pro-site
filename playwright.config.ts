import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.SITE_BASE_URL || "http://127.0.0.1:8000",
    trace: "on-first-retry",
  },
  webServer: process.env.SITE_BASE_URL ? undefined : {
    command: "python -m http.server 8000 --bind 127.0.0.1",
    cwd: process.env.SITE_ROOT || ".",
    url: "http://127.0.0.1:8000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
