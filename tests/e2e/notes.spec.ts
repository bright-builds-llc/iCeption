import { expect, test } from "@playwright/test";
import {
  gotoInstalledContextMode,
  openApp,
  waitForHomeScreen,
} from "./fixtures/launcher";

test.describe("notes app", () => {
  test("creates, edits, reopens, and keeps the local-only warning visible", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);
    await openApp(page, "notes");

    await expect(page.getByTestId("notes-app")).toBeVisible();
    await expect(page.getByTestId("notes-local-warning")).toBeVisible();

    await page.getByTestId("notes-create").click();
    await page.getByTestId("notes-title-input").fill("Groceries");
    await page.getByTestId("notes-body-input").fill("Eggs and milk");

    const noteItem = page.locator('[data-testid^="notes-item:"]').first();
    await expect(noteItem).toContainText("Groceries");
    await expect(noteItem).toContainText("Eggs and milk");

    await page.reload();
    await waitForHomeScreen(page);
    await openApp(page, "notes");

    await expect(page.getByTestId("notes-local-warning")).toBeVisible();
    await expect(page.getByTestId("notes-title-input")).toHaveValue(
      "Groceries",
    );
    await expect(page.getByTestId("notes-body-input")).toHaveValue(
      "Eggs and milk",
    );
  });
});
