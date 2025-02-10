import { test, expect } from '@playwright/test';
import { loginAndNavigateToCarePanel, openForm } from '../helpers';

  test('Fill Patient MCH Delivery Form', async ({ page }) => {
    const patientId = 'ab9b95fb-258f-11eb-b601-02de43086cfb';
    const formName = 'MCH Delivery Form';
  
    // Login and navigate to Care Panel
    await loginAndNavigateToCarePanel(page, patientId);
  
    // Open the correct form
    await openForm(page, formName);

  // Close notification if it appears
  try {
    await page.getByLabel('close notification').click();
  } catch {}

  // Fill form fields
  console.log('Filling MCH Delivery Form');
  await page.locator('#admNumberid').fill('1');
  await page.locator('#noOfAncVisitsid').fill('1');

  console.log('Navigating to Patient History');
  await page.getByText('NextPatient History').click();

  // Directly insert the date instead of using the date picker
  console.log('Filling LMP Date');
  await page.locator('#lastLmpDateid').fill('4/20/2024'); // Adjust field ID if needed

  console.log('Selecting Delivery Mode');
  await page.locator('#deliveryModeid').selectOption([
    '1171AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    '1172AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  ]);

  // Directly set another date
  console.log('Setting Date & Time');
  await page.getByPlaceholder('dd/mm/yyyy hh:mm').fill('1/20/2025, 12:00 AM');

  console.log('Answering Yes/No Questions');
  await page.getByLabel('Yes').check();

  console.log('Navigating to Patient Examination');
  await page.getByRole('button', { name: 'Patient Examination', exact: true }).click();
  await page.locator('#placentaCompleteid_0').check();

  console.log('Navigating to Patient Management');
  await page.getByRole('button', { name: 'Patient Management', exact: true }).click();
  await page.getByRole('radio', { name: 'None' }).check();

  console.log('Completing Management Section');
  await page.locator('fieldset').filter({ hasText: 'Yes No N/A' }).locator('label').first().click();
  await page.locator('#vitaminKid_0').check();

  console.log('Saving and closing the form');
  await page.getByRole('button', { name: 'Save and close' }).click();

  // Adjustments for accordion-based sections
  try {
    console.log('Handling accordion sections');
    await page.locator('[id=\"accordion-item-\\\\:r27\\\\:\"] ofe-form-renderer')
      .filter({ hasText: 'Gestation at birth (in weeks' })
      .getByLabel('Decrement')
      .click();
  } catch {}

  await page.getByRole('button', { name: 'Save and close' }).click();
});
