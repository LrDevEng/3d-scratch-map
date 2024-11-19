import { expect, test } from '@playwright/test';

test('User registration, log in, logout', async ({ page }) => {
  // Go to landing page
  await page.goto('/');
  await expect(page.getByTestId('landing-page-title')).toBeVisible();

  // Open register form
  await page.getByTestId('landing-page-register-button').click();
  await expect(page.getByTestId('landing-page-form-title')).toBeVisible();
});
