import { test, expect, Browser, Page } from '@playwright/test';
import { loginAndOpenForm } from '../../mch-mother-service/helpers';

test.describe.parallel('MCH Antenatal Full Form Submission', () => {
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
    await page.getByRole('button', { name: 'Save and close' }).click();
    console.log('Patient Management section filled successfully');
  }

  // Reusable login and form opening
  async function loginAndStartForm(page: Page): Promise<void> {
    const patientName = 'Hellen Andanje Omukunde';
    const formName = 'MCH Antenatal Visit';
    console.log('Logging in and opening the form...');
    await loginAndOpenForm(page, patientName, formName);
    console.log('Login successful. Starting tests...');
  }

  // Test for Visit 1
  test('MCH Antenatal Full Form Submission - Visit 1', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await loginAndStartForm(page);

      // Perform actions for Visit 1
      console.log('Starting visit 1');
      await performTestActions(page, 1); // Perform actions for Visit 1

    //   // Check out Visit 1
    //   console.log('Checking out for visit 1');
    //   await page.getByRole('button', { name: 'Check Out' }).click();
    //   await page.getByRole('button', { name: 'danger End Visit' }).click();
    //   await page.waitForSelector('text=Visit completed', { timeout: 5000 }); // Wait for confirmation

    } finally {
      await context.close();
    }
  });
});
