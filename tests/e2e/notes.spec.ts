import { expect, test } from "@playwright/test";
import {
  gotoInstalledContextMode,
  openApp,
  waitForHomeScreen,
} from "./fixtures/launcher";

test.describe("notes app", () => {
  test("searches, organizes, reopens, and keeps the local-only warning visible", async ({
    page,
  }) => {
    await gotoInstalledContextMode(page);
    await openApp(page, "notes");

    await expect(page.getByTestId("notes-app")).toBeVisible();
    await expect(page.getByTestId("notes-local-warning")).toBeVisible();
    await expect(page.getByTestId("notes-search-input")).toBeVisible();

    await page.getByTestId("notes-folder-input").fill("Recipes");
    await page.getByTestId("notes-folder-save").click();
    await expect(
      page.getByTestId("notes-folder-filter:recipes"),
    ).toBeVisible();

    await page.getByTestId("notes-create").click();
    await page.getByTestId("notes-title-input").fill("Groceries");
    await page.getByTestId("notes-body-input").fill("Eggs and milk");

    const noteItem = page.locator('[data-testid^="notes-item:"]').first();
    await expect(noteItem).toContainText("Groceries");
    await expect(noteItem).toContainText("Eggs and milk");
    await expect(page.getByTestId("notes-folder-select")).not.toHaveValue(
      "notes-folder-default",
    );

    await page.getByTestId("notes-folder-filter:all").click();
    await page.getByTestId("notes-create").click();
    await page.getByTestId("notes-title-input").fill("Standup");
    await page.getByTestId("notes-body-input").fill("Launch progress");

    await page.getByTestId("notes-search-input").fill("milk");
    await expect(page.getByTestId("notes-list")).toContainText(
      "Groceries",
    );
    await expect(page.getByTestId("notes-list")).not.toContainText(
      "Standup",
    );

    await page.getByTestId("notes-search-input").fill("");
    await page.getByTestId("notes-folder-filter:recipes").click();
    await expect(page.getByTestId("notes-list")).toContainText(
      "Groceries",
    );
    await expect(page.getByTestId("notes-list")).not.toContainText(
      "Standup",
    );

    await page.reload();
    await waitForHomeScreen(page);
    await openApp(page, "notes");

    await expect(page.getByTestId("notes-local-warning")).toBeVisible();
    await page.getByTestId("notes-folder-filter:recipes").click();
    await expect(page.getByTestId("notes-title-input")).toHaveValue(
      "Groceries",
    );
    await expect(page.getByTestId("notes-body-input")).toHaveValue(
      "Eggs and milk",
    );

    await page.getByTestId("notes-folder-filter:all").click();
    await page.getByTestId("notes-search-input").fill("launch");
    await expect(page.getByTestId("notes-title-input")).toHaveValue(
      "Standup",
    );
  });
});
