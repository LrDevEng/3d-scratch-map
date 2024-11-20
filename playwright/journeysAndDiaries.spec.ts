import { expect, test } from '@playwright/test';

test('Create/delete journey and diary', async ({ page }) => {
  test.setTimeout(180_000);

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

  // Wait for globe page
  await page.waitForURL('/my-globe/*');
  await expect(page.getByTestId('loading-map')).toBeVisible();
  await page.getByTestId('loading-map').isHidden();
  await expect(
    page.getByTestId('my-globe-page-country-dropdown'),
  ).toBeVisible();

  // Go to country specific page
  await page
    .getByTestId('my-globe-page-country-dropdown')
    .selectOption('Canada');
  await page.waitForURL('/my-globe/*/can');
  await expect(page.getByTestId('country-overview-name')).toBeVisible();
  await expect(page.getByTestId('add-journey-button')).toBeVisible();

  // Add journey
  await page.getByTestId('add-journey-button').click();
  await expect(page.getByTestId('journey-form-title')).toBeVisible();
  await expect(page.getByTestId('journey-form-start-date')).toBeVisible();
  await expect(page.getByTestId('journey-form-end-date')).toBeVisible();
  await expect(page.getByTestId('journey-form-summary')).toBeVisible();
  await expect(page.getByTestId('journey-form-save-button')).toBeVisible();
  await page.getByTestId('journey-form-title').fill('Andor');
  await page
    .getByTestId('journey-form-summary')
    .fill('My Adventures in Andor.');
  await page.getByTestId('journey-form-save-button').click();
  await expect(
    page.getByTestId('journey-card-compact-can-Andor'),
  ).toBeVisible();

  // Go to journey specific page
  await page.getByTestId('journey-card-compact-can-Andor').click();
  await expect(page.getByTestId('journey-details-title')).toBeVisible();
  await expect(page.getByTestId('add-diary-button')).toBeVisible();

  // Add diary
  await page.getByTestId('add-diary-button').click();
  await expect(page.getByTestId('diary-form-title')).toBeVisible();
  await expect(page.getByTestId('diary-form-date')).toBeVisible();
  await expect(page.getByTestId('diary-form-thoughts')).toBeVisible();
  await expect(page.getByTestId('diary-form-save-button')).toBeVisible();
  await page.getByTestId('diary-form-title').fill('Diary');
  await page.getByTestId('diary-form-thoughts').fill('Diary thoughts.');
  await page.getByTestId('diary-form-save-button').click();
  await expect(page.getByTestId('diary-view-title-Diary')).toBeVisible();
  await expect(page.getByTestId('diary-view-edit-button')).toBeVisible();

  // Delete diary
  await page.getByTestId('diary-view-edit-button').click();
  await expect(page.getByTestId('diary-form-delete-button')).toBeVisible();
  await page.getByTestId('diary-form-delete-button').click();
  await expect(page.getByTestId('diary-view-title-Diary')).toBeVisible({
    timeout: 10000,
    visible: false,
  });
  await expect(page.getByTestId('go-back-to-journey-button')).toBeVisible();

  // Go back to journey
  await page.getByTestId('go-back-to-journey-button').click();
  await expect(
    page.getByTestId('journey-card-compact-can-Andor'),
  ).toBeVisible();
  await expect(page.getByTestId('edit-journey-button')).toBeVisible();

  // Delete journey
  await page.getByTestId('edit-journey-button').click();
  await expect(page.getByTestId('journey-form-delete-button')).toBeVisible();
  await page.getByTestId('journey-form-delete-button').click();
  await expect(page.getByTestId('journey-card-compact-can-Andor')).toBeVisible({
    timeout: 10000,
    visible: false,
  });

  // Close country page
  await expect(page.getByTestId('close-country-view-button')).toBeVisible();
  await page.getByTestId('close-country-view-button').click();
  await page.waitForURL('/my-globe/*');

  // Go to profile page
  await page.getByTestId('nav-bar-profile').click();
  await page.waitForURL('/profile');

  // Delete account
  await expect(
    page.getByTestId('profile-page-delete-account-button'),
  ).toBeVisible();
  await page.getByTestId('profile-page-delete-account-button').click();
  await expect(page.getByTestId('profile-page-confirm-deletion')).toBeVisible();
  await page.getByTestId('profile-page-confirm-deletion').click();
  await expect(page.getByTestId('landing-page-title')).toBeVisible({
    timeout: 15000,
  });
});
