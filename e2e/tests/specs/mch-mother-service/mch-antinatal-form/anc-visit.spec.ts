import { expect, Page } from '@playwright/test';
import { test } from '../../../core';
import { generateRandomPatient, startVisit, generateMCHEnrollmentEncounter } from '../../../commands';
import { loginAndNavigateToCarePanel, openForm } from '../helpers';
import { CarePanelPage } from '../../../pages';

let patient: any;
let visit: any;

test('MCH Antenatal Visit  Form Submission', async ({ page,api }) => {
  const gender = 'F';
  const age = 25; // Set the age of the patient
  const currentYear = new Date().getFullYear();
  const birthdate = `${currentYear - age}-06-15`;

  patient = await generateRandomPatient(api, gender, birthdate);
  console.log('Patient created:', patient);
  visit = await startVisit(api, patient.uuid);

  await page.waitForTimeout(1000);
  const mchEnrollment = await generateMCHEnrollmentEncounter(api, patient.uuid, visit);
  console.log('Patient Enrolled:', mchEnrollment);

  const formName = 'MCH Antenatal Visit';

  console.log('Logging in and navigating to Care Panel...');
  const carePanelPage = new CarePanelPage(page);
  await carePanelPage.gotoCarePanel(patient.uuid);
  console.log('Successfully navigated to Care Panel');

  console.log(`Opening form: ${formName}...`);
  await openForm(page, formName);
  console.log('Form opened successfully');

  await performTestActions(page, 1);
});

async function performTestActions(page: Page, visitNumber: number): Promise<void> {
  console.log('Filling Patient History section...');
  await page.locator('#visitNumberid').fill(String(visitNumber));
  await page.getByLabel('Decrement').nth(1).click();

  await page.getByText('NextPatient History').click();
  await page.locator('#preConceptioncareid_1').check();
  await page.locator('label').filter({ hasText: 'None' }).first().click();
  await page.locator('label').filter({ hasText: 'Cesarean section' }).click();
  await page.locator('#fgmDoneid_1').check();
  await page.getByText('No', { exact: true }).nth(2).click();
  await page.locator('#chronicIllnessid_1').check();
  console.log('Patient History section filled successfully');

  console.log('Filling Patient Examination section...');
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

  console.log('Filling Patient Management section...');
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
  console.log('Form submitted successfully!');
};

