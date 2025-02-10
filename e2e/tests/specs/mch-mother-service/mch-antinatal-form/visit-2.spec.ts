import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToCarePanel, openForm } from '../helpers';

test('MCH Antenatal Visit 1 Form Submission', async ({ page }) => {
    const patientId = '77280233-a8d3-4d20-95f5-b921094d347e';
    const formName = 'MCH Antenatal Visit';

    console.log('Logging in and navigating to Care Panel...');
    await loginAndNavigateToCarePanel(page, patientId);
    console.log('Successfully navigated to Care Panel');

    console.log(`Opening form: ${formName}...`);
    await openForm(page, formName);
    console.log('Form opened successfully');

    await performTestActions(page, 1);
});
async function performTestActions(page: Page, visitNumber: number): Promise<void> {

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
// Check for validation errors (specifically "This field is required!" text)
  const requiredFieldError = await page.locator('text="This field is required!"').count();

  // Fail the test if any "This field is required!" error is found
  if (requiredFieldError > 0) {
    console.error(`⚠️ Form contains ${requiredFieldError} required field(s) missing!`);
    
    // Capture and log the fields with the "This field is required!" message
    const errorText = await page.locator('text="This field is required!"').allTextContents();
    console.log('Validation errors:', errorText.join('\n'));

    expect(requiredFieldError).toBe(0); // Fail the test if there are validation errors
    return; // Stop execution if validation errors are found
  }
  // Wait for 60 seconds before ending the test
  console.log('Waiting for 60 seconds...');
  await page.waitForTimeout(60000); // Wait for 60 seconds (60,000 milliseconds)
  // Wait for the submission response and check if an error occurred
  const submissionResponse = await page.waitForResponse(response => response.status() === 200, { timeout: 60000 });
  const responseBody = await submissionResponse.body();
 // Check if the error message "Lock wait timeout exceeded" is in the response body
  if (responseBody.includes('Lock wait timeout exceeded')) {
    console.error('⚠️ Lock wait timeout error detected during form submission.');
    throw new Error('Form submission failed due to database lock wait timeout.');
  }
};
