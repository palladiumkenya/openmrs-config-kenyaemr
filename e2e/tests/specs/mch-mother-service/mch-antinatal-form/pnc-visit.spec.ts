import { expect, Page } from '@playwright/test';
import { test } from '../../../core';
import { generateRandomPatient, startVisit, generateMCHEnrollmentEncounter } from '../../../commands';
import { loginAndNavigateToCarePanel, openForm } from '../helpers';
import { CarePanelPage } from '../../../pages';

let patient: any;
let visit: any;

const getCurrentDateFormatted = (): string => {
  const today = new Date();

  const day = today.getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[today.getMonth()];  // Get month name
  const year = today.getFullYear();

  return `${day} ${month} ${year}`;
};

test('MCH PNC Form Submission', async ({ page, api }) => {
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

  const formName = 'MCH Postnatal Visit';

  console.log('Logging in and navigating to Care Panel...');
  const carePanelPage = new CarePanelPage(page);
  await carePanelPage.gotoCarePanel(patient.uuid);
  console.log('Successfully navigated to Care Panel');

  console.log(`Opening form: ${formName}...`);
  await openForm(page, formName);
  console.log('Form opened successfully');

  await performTestActions(page, 5);
});

async function performTestActions(page: Page, visitNumber: number): Promise<void> {
  console.log('Filling Patient Visit details...');
  await page.locator('#pncRegisterNumberid').fill('PNC-2025-01-2001');
  await page.locator('#pncVisitNumberid').fill(String(visitNumber));
  await page.getByLabel('Decrement').click();
  await page.locator('#visitTimingMotherid_2').click();
  await page.locator("#visitTimingBaby\\:id_2").click();
  await page.getByText('NextPatient History').click();

  console.log('Filling Patient History section...');
  await page.locator('#deliveryDateid').fill(getCurrentDateFormatted());
  await page.locator('#deliveryModeid_1').click();
  await page.locator('#deliveryPlaceid_1').click();
  await page.getByText('NextPatient Examination').click();
  
  console.log('Filling Patient Examination section...');
  await page.locator('#generalConditionid_0').click();
  await page.locator('#breastid_0').click();
  await page.locator('#pphid_1').click();
  await page.locator('#uterusid_0').click();
  await page.locator('#pallorid_0').click();
  await page.locator('#pallorSeverityid_0').click();
  // await page.locator('#uterusInvolutionid').selectOption('123427AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  // await page.locator('#episiotomyid').selectOption('1175AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#lochiaid_0').click();
  await page.locator('#maternalConditionid').selectOption('160429AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#fistulaScreeningid').selectOption('1107AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#cacxScreeningid').selectOption('664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#screeningCacxMethodid_0').click();
  await page.locator('#tbScreening\\:id_0').click();
  await page.locator('#otherMaternalComplicationsid').fill('None');
  
  await page.locator('#deliveryOutcomeid').selectOption('159913AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.getByRole('button', { name: 'Add', exact: true }).nth(0).click();
  await page.locator('#babyConditionSingleid').selectOption('1855AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#feedingMethodSingleid').selectOption('5526AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#umbilicalCordSingleid').selectOption('162126AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#immunizationSingleid0_0').click();
  
  await page.locator('#eligibleTestid_1').click();
  await page.locator('#syphllTXid_1').click();
  await page.locator('#partnerTestedid_0').click();
  await page.locator('#partnerHivStatusid').selectOption('664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#investigationOrderdid_1').click();
  await page.getByText('NextPatient Management').click();
  
  console.log('Filling Patient Management section...');
  await page.locator('#physicalExercisesid_0').click();
  await page.locator('#counselledInfantFeedingid_0').click();
  await page.locator('#ironSupplimentationid_0').click();
  await page.locator('#counselledFamilyPlanningid_0').click();
  await page.locator('label').filter({ hasText: /^Intrauterine Device$/ }).click();
  
  await page.locator('#referredFromid').selectOption('1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#referredToid').selectOption('163488AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#clinicalNotes\\/id').fill('Healthy living');
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

