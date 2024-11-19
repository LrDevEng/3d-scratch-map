import { expect, test } from '@playwright/test';

test('User registration, log in, logout', async ({ page }) => {
  // test.slow();

  // Go to landing page
  await page.goto('/');
  await expect(page.getByTestId('landing-page-title')).toBeVisible();

  // Open login form
  await page.getByTestId('landing-page-login-button').click();
  await page.waitForURL('/log-in');
  await expect(page.getByTestId('landing-page-form-email')).toBeVisible();
  await expect(page.getByTestId('landing-page-form-password')).toBeVisible();

  // Fill in login form
  await page.getByTestId('landing-page-form-email').fill('Lukas@Tester.com');
  await page.getByTestId('landing-page-form-password').fill('12345678');

  // Submit login form
  await page.getByTestId('landing-page-form-continue').click();
  await page.waitForURL('/my-globe/1');
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
  await page.getByTestId('landing-page-form-email').fill('Lukas@Tester.com');
  await page.getByTestId('landing-page-form-password').fill('12345678');
  await page.getByTestId('landing-page-form-continue').click();
  await page.waitForURL('/profile');

  // // Open register form
  // await page.getByTestId('landing-page-register-button').click();
  // await expect(page.getByTestId('landing-page-form-title')).toBeVisible();
  // await expect(page.getByTestId('landing-page-form-given-name')).toBeVisible();
  // await expect(page.getByTestId('landing-page-form-family-name')).toBeVisible();
  // await expect(page.getByTestId('landing-page-form-email')).toBeVisible();
  // await expect(page.getByTestId('landing-page-form-password')).toBeVisible();
  // await expect(
  //   page.getByTestId('landing-page-form-password-repeat'),
  // ).toBeVisible();

  // // Fill in register form
  // await page.getByTestId('landing-page-form-given-name').fill('Pippi2');
  // await page.getByTestId('landing-page-form-family-name').fill('Langstrumpf');
  // await page
  //   .getByTestId('landing-page-form-email')
  //   .fill('Pippi2@Kunterbunt.com');
  // await page.getByTestId('landing-page-form-password').fill('1b3d5f7h910');
  // await page
  //   .getByTestId('landing-page-form-password-repeat')
  //   .fill('1b3d5f7h910');

  // // Submit register form
  // await page.getByTestId('landing-page-form-continue').click();
  // await page.waitForURL('/my-globe/1');
  // await expect(
  //   page.getByTestId('my-globe-page-country-dropdown'),
  // ).toBeVisible();
});
