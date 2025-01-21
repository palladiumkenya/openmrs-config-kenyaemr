import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa.kenyahmis.org/openmrs/spa/login');
  await page.getByLabel('Username').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Password').fill('Admin123');
  await page.getByRole('button', { name: 'Log in' }).click();

  // Close notification if it appears
  try {
    await page.getByLabel('close notification').click();
  } catch {}

  await page.getByRole('link', { name: 'Test HTS Client' }).click();
  await page.getByLabel('Clinical forms').click();
  await page.getByText('MCH Delivery Form').click();
  await page.locator('#admNumberid').fill('1');
  await page.locator('#noOfAncVisitsid').fill('1');
  await page.getByText('NextPatient History').click();

  // Directly insert the date instead of using the date picker
  await page.locator('#lastLmpDateid').fill('4/20/2024'); // Replace with the correct field ID or selector

  await page.locator('#deliveryModeid').selectOption('1171AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#deliveryModeid').selectOption('1172AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  // Directly set another date
  await page.getByPlaceholder('dd/mm/yyyy hh:mm').fill('1/20/2025, 12:00 AM');

  // await page.getByRole('button', { name: 'Set' }).click();

  // Handle conditional notifications
  // try {
  //   await page.getByLabel('close notification').click();
  // } catch {}

  await page.getByLabel('Yes').check();
  await page.getByRole('button', { name: 'Patient Examination', exact: true }).click();
  await page.locator('#placentaCompleteid_0').check();
  await page.getByRole('button', { name: 'Patient Management', exact: true }).click();
  await page.getByRole('radio', { name: 'None' }).check();

  await page.locator('fieldset').filter({ hasText: 'Yes No N/A' }).locator('label').first().click();
  await page.locator('#vitaminKid_0').check();
  await page.getByRole('button', { name: 'Save and close' }).click();
  await page.locator('[id=\"accordion-item-\\\\:r27\\\\:\"] ofe-form-renderer').filter({ hasText: 'Gestation at birth (in weeks' }).getByLabel('Decrement').click();
  await page.getByRole('button', { name: 'Save and close' }).click();
});
