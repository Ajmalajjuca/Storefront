import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const isCI = Boolean(process.env.CI);
const distDir =
  process.env.PLAYWRIGHT_DIST_DIR || (isCI ? ".next" : ".next-playwright");
const useSystemChrome =
  !isCI || process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === "1";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(useSystemChrome ? { channel: "chrome" as const } : {}),
      },
    },
  ],
  webServer: {
    command: isCI
      ? `npm run start -- --hostname 127.0.0.1 --port ${port}`
      : `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    env: {
      ...process.env,
      NEXT_DIST_DIR: distDir,
      SHOPIFY_STOREFRONT_ACCESS_TOKEN: "",
      SHOPIFY_STORE_DOMAIN: "",
      SHOPIFY_WEBHOOK_SECRET: "playwright-webhook-secret",
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: `http://127.0.0.1:${port}`,
  },
});
