import { test } from '@playwright/test';
import { loginAndOpenForm } from '../helpers';

test('Fill MCH Antenatal Visit Form', async ({ page }) => {
  // Reuse the login and form selection function
  await loginAndOpenForm(page, 'Rnuria Rnuria Rnuria', 'MCH Antenatal Visit');

  // Fill the visit number and decrement ANC Visit
  console.log('Filling visit details');
  await page.locator('#visitNumberid').click();
  await page.locator('#visitNumberid').fill('5');
  await page.locator('#clinicNumberid').click();
  await page.locator('#clinicNumberid').fill('2024-10-29');
  await page.getByLabel('Decrement').nth(1).click();

  // Navigate to Patient History
  console.log('Navigating to Patient History');
  await page.getByText('NextPatient History').click();

  // Fill out the fields in the Patient History section
  console.log('Filling Patient History section');
  await page.locator('#preConceptioncareid_1').check();
  await page.locator('label').filter({ hasText: 'None' }).first().click();
  await page.locator('label').filter({ hasText: 'None' }).nth(1).click();
  await page.locator('#fgmDoneid_1').check();
  await page.locator('#historyOfSTIid_0').check();
  await page.locator('#chronicIllnessid_1').check();

  console.log('Patient History section filled successfully');

  // Navigate to Patient Examination
  console.log('Navigating to Patient Examination');
  await page.getByText('NextPatient Examination').click();

  // Fill out the fields in the Patient Examination section
  console.log('Filling Patient Examination section');
  await page.getByLabel('Normal', { exact: true }).check();
  await page.locator('#pallorid_1').check();
  await page.getByLabel('Decrement').first().click();
  await page.getByLabel('Frank Breech Presentation').check();
  await page.getByLabel('Longitudinal lie').check();
  await page.getByLabel('Decrement').nth(1).click();
  await page.locator('#foetalMvtid').selectOption('162108AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#consentGivenid_1').check();
  await page.locator('#partnerTestedid_1').check();
  await page.locator('#tbScreeningid').selectOption('164128AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.getByLabel('Negative').check();
  await page.locator('#investigationOrderdid_1').check();

  console.log('Patient Examination section filled successfully');

  // Navigate to Patient Management
  console.log('Navigating to Patient Management');
  await page.getByText('NextPatient Management').click();

  // Fill out the fields in the Patient Management section
  console.log('Filling Patient Management section');
  await page.locator('#physicalExercisesid_0').check();
  await page.locator('#dewormingDoneid_0').check();
  await page.locator('#iptGivenid_1').check();
  await page.locator('#counSelledid_1').check();
  await page.locator('#minPackgid_1').check();
  await page.locator('#minPackgid_0').check();
  await page.locator('#referredFromid').selectOption('163488AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#referredToid').selectOption('163488AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  console.log('Patient Management section filled successfully');

  // Save and Close the Form
  console.log('Saving and closing the form');
  await page.getByRole('button', { name: 'Save and close' }).click();
});
