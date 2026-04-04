import { expect, type Page } from "@playwright/test";

export async function gotoBrowserMode(page: Page) {
  await page.goto("/");
  await expect(page.locator("main.app-shell")).toHaveAttribute(
    "data-install-context",
    "browser",
  );
  await expect(page.getByTestId("install-overlay")).toBeVisible();
}

export async function gotoStandaloneMode(page: Page) {
  await page.goto("/?openos-install-context=standalone");
  await expect(page.locator("main.app-shell")).toHaveAttribute(
    "data-install-context",
    "standalone",
  );
  await waitForHomeScreen(page);
}

export async function openApp(page: Page, appId: string) {
  await page.getByTestId(`app-icon:${appId}`).click();
  await expect(page.getByTestId(`app-surface:${appId}`)).toBeVisible();
}

export async function returnHome(page: Page, appId: string) {
  await page.getByTestId("home-pill").click();
  await expect(page.getByTestId(`app-surface:${appId}`)).toBeHidden();
  await waitForHomeScreen(page);
}

export async function waitForHomeScreen(page: Page) {
  await expect(page.getByLabel("openOS shell foundation")).toBeVisible();
  await expect(page.getByTestId("app-icon:calculator")).toBeVisible();
}
