import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa.kenyahmis.org/openmrs/spa/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('Admin123');
  await page.getByLabel('Password').press('Enter');
  await page.getByRole('link', { name: 'Pamela Russell Cox' }).click();
  
  await page.getByLabel('Clinical forms').click();
  await page.getByRole('cell', { name: 'MCH Antenatal Visit' }).click();
  await page.getByText('MCH Antenatal Visit').click();
});
