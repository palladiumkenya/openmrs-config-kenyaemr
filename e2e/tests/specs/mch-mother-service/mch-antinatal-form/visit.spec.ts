import { test, expect, Page } from '@playwright/test';
import { loginAndNavigateToCarePanel, openForm } from '../../mch-mother-service/helpers';

test('MCH Antenatal Visit 2 Form Submission', async ({ page }) => {
    const patientId = '77280233-a8d3-4d20-95f5-b921094d347e';
    const formName = 'MCH Antenatal Visit';

    console.log('Logging in and navigating to Patient profile...');
    await loginAndNavigateToCarePanel(page, patientId);
    console.log('Successfully navigated to Patient profile');

    console.log(`Opening form: ${formName}...`);
    await openForm(page, formName);
    console.log('Form opened successfully');

    await performTestActions(page, 1);
});
  // Function to perform the test actions for filling out the form
  async function performTestActions(page: Page, visitNumber: number): Promise<void> {
    // Fill the visit number and decrement ANC Visit
    await page.locator('#visitNumberid').fill(String(visitNumber));
    await page.getByLabel('Decrement').nth(1).click();

   // Navigate and fill the Patient History section
    await page.getByText('NextPatient History').click();
    await page.locator('#preConceptioncareid_1').check();
    await page.locator('label').filter({ hasText: 'None' }).first().click();
    await page.locator('label').filter({ hasText: 'Cesarean section' }).click();
    await page.locator('#fgmDoneid_1').check();
    await page.getByText('No', { exact: true }).nth(2).click();
    await page.locator('#chronicIllnessid_1').check();
    console.log('Patient History section filled successfully');

    // Navigate and fill the Patient Examination section
    await page.getByText('NextPatient Examination').click();
    await page.getByLabel('Normal', { exact: true }).check();
    await page.locator('#pallorid_1').check();
    await page.getByLabel('Decrement').first().click();
    await page.getByLabel('Vertex presentation').check();
    await page.getByLabel('Oblique lie').check();
    await page.getByLabel('Decrement').nth(1).click();
    await page.locator('#foetalMvtid').selectOption('162108AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.locator('#eligibleTestid_1').check();
    await page.locator('#partnerTestedid_1').check();
    await page.getByText('TB Screening Results: NO').click();
    await page.locator('#tbScreeningid').selectOption('1660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.locator('#cacxScreeningid').selectOption('664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByLabel('Pap Smear').check();
    await page.locator('#hepBscreenid_0').check();
    await page.locator('#treatmentPosid_0').check();
    await page.locator('#syphilisTestResultsBid_0').check();
    await page.getByLabel('Poor Sample quality').check();
    await page.locator('li').filter({ hasText: 'Investigations Order any' }).locator('label').nth(2).click();
    console.log('Patient Examination section filled successfully');

    // Navigate and fill the Patient Management section
    await page.getByText('NextPatient Management').click();
    await page.locator('#physicalExercisesid_1').check();
    await page.locator('#iptGivenid_1').check();
    await page.locator('#referredToid').selectOption('1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.locator('#reasonReferralid').fill('note given');
    await page.locator('#clinicalNotesid').fill('fine now');
    console.log('Patient Management section filled successfully');

    console.log('Saving the form...');
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
