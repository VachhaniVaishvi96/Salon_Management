// @ts-check
import { test, expect } from '@playwright/test';

test('custormer login successful', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page).toHaveTitle(/Playwright/);
});


