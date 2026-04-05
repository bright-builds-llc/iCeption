import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  outputDir: "test-results",
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:42317",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "webkit-iphone",
      use: {
        ...devices["iPhone 13"],
      },
    },
  ],
  webServer: {
    command:
      "pnpm build && pnpm exec vite preview --strictPort --host 127.0.0.1 --port 42317",
    port: 42317,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
