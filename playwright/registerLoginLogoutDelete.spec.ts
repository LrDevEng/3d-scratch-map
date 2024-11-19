import { expect, test } from '@playwright/test';

test('Register, log in, logout, delete account', async ({ page }) => {
  test.slow();

  // Go to landing page
  await page.goto('/');
  await expect(page.getByTestId('landing-page-title')).toBeVisible();

  // Open register form
  await page.getByTestId('landing-page-register-button').click();
  await expect(page.getByTestId('landing-page-form-title')).toBeVisible();
  await expect(page.getByTestId('landing-page-form-given-name')).toBeVisible();
  await expect(page.getByTestId('landing-page-form-family-name')).toBeVisible();
  await expect(page.getByTestId('landing-page-form-email')).toBeVisible();
  await expect(page.getByTestId('landing-page-form-password')).toBeVisible();
  await expect(
    page.getByTestId('landing-page-form-password-repeat'),
  ).toBeVisible();

  // Fill in register form
  await page.getByTestId('landing-page-form-given-name').fill('Luke');
  await page.getByTestId('landing-page-form-family-name').fill('Skywalker');
  await page
    .getByTestId('landing-page-form-email')
    .fill('L.Skywalker@Tatooine.com');
  await page.getByTestId('landing-page-form-password').fill('lastjedi');
  await page.getByTestId('landing-page-form-password-repeat').fill('lastjedi');

  // Submit register form
  await page.getByTestId('landing-page-form-continue').click();
  await page.waitForURL('/my-globe/*');
  await expect(
    page.getByTestId('my-globe-page-country-dropdown'),
  ).toBeVisible();

  // Go to profile page
  await page.getByTestId('nav-bar-profile').click();
  await page.waitForURL('/profile');

  // Logout
  await page.getByTestId('profile-logout-button').click();
  await page.waitForURL('/log-in?returnTo=/profile');
  await page.goto('/');

  // Open login form
  await page.getByTestId('landing-page-login-button').click();
  await page.waitForURL('/log-in');
  await expect(page.getByTestId('landing-page-form-email')).toBeVisible();
  await expect(page.getByTestId('landing-page-form-password')).toBeVisible();

  // Fill in login form
  await page
    .getByTestId('landing-page-form-email')
    .fill('L.Skywalker@Tatooine.com');
  await page.getByTestId('landing-page-form-password').fill('lastjedi');

  // Submit login form
  await page.getByTestId('landing-page-form-continue').click();
  await page.waitForURL('/my-globe/*');
  await expect(
    page.getByTestId('my-globe-page-country-dropdown'),
  ).toBeVisible();

  // Go to profile page
  await page.getByTestId('nav-bar-profile').click();
  await page.waitForURL('/profile');

  // Logout
  await page.getByTestId('profile-logout-button').click();
  await page.waitForURL('/log-in?returnTo=/profile');

  // Log in again
  await expect(page.getByTestId('landing-page-form-email')).toBeVisible();
  await expect(page.getByTestId('landing-page-form-password')).toBeVisible();
  await page
    .getByTestId('landing-page-form-email')
    .fill('L.Skywalker@Tatooine.com');
  await page.getByTestId('landing-page-form-password').fill('lastjedi');
  await page.getByTestId('landing-page-form-continue').click();
  await page.waitForURL('/profile');

  // Delete account
  await expect(
    page.getByTestId('profile-page-delete-account-button'),
  ).toBeVisible();
  await page.getByTestId('profile-page-delete-account-button').click();
  await expect(page.getByTestId('profile-page-confirm-deletion')).toBeVisible();
  await page.getByTestId('profile-page-confirm-deletion').click();
  await expect(page.getByTestId('landing-page-title')).toBeVisible();
});
