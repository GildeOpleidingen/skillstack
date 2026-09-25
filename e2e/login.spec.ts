import { test, expect } from "@playwright/test";

// Test unauthenticated users
test("unauthenticated users are redirected to login", 
  async ({ page }) => {  
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);  
    await expect(    page.getByRole("heading", { name: /login/i }),  ).toBeVisible();
  }
);