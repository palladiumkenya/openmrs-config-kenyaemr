import { expect } from '@playwright/test';
import { test } from '../../../core';
import { generateRandomPatient, startVisit } from '../../../commands';
import { loginAndNavigateToCarePanel, openForm } from '../helpers';
import { CarePanelPage } from '../../../pages';

let patient: any;
let visit: any;


test('Fill Patient Enrollment Form', async ({ page, api }) => {
  const gender = 'F';
  const age = 25; // Set the age of the patient
  const currentYear = new Date().getFullYear();
  const birthdate = `${currentYear - age}-06-15`;

  patient = await generateRandomPatient(api, gender, birthdate);
  console.log('Patient created:', patient);
  visit = await startVisit(api, patient.uuid);
  console.log('Visit created:', visit);

  const formName = 'MCH - Mother Services';

  const carePanelPage = new CarePanelPage(page);
  await carePanelPage.gotoCarePanel(patient.uuid);

  // Open the correct form
  await openForm(page, formName);

  console.log('Selecting Service Type...');
  await page.getByLabel('PNC').check();

  console.log('Filling ANC Clinic Number...');
  await page.locator('#ancNumberid').fill('2025-01-2001');

  console.log('Incrementing & Decrementing Fields...');
  await page.getByRole('button', { name: 'Increment' }).first().click();
  await page.getByRole('button', { name: 'Increment' }).nth(1).click();
  await page.getByRole('button', { name: 'Decrement' }).nth(3).click();
  await page.getByRole('button', { name: 'Decrement' }).nth(4).click();

  console.log('Filling Last Menstrual Period (LMP)...');
  await page.locator('#lmpDateid').fill('03/29/2024');

  console.log('Checking Estimated LMP...');
  await page.locator('#estimatedLmpid_0').check();

  console.log('Filling EDD Details...');
  await page.locator('#lmpEddid').fill('03/01/2025');
  await page.locator('#ultrasoundEddid').fill('04/30/2024');

  console.log('Filling Gestational Age...');
  await page.locator('#gestAgeid').fill('43');

  console.log('Selecting Type of Pregnancy...');
  await page.getByLabel('Intended', { exact: true }).check();

  console.log('Filling Date of First ANC Visit...');
  await page.locator('#firstAncDateid').fill('04/30/2024');

  console.log('Selecting HIV & TB Screening Status...');
  await page.locator('#patientHivStatusid').selectOption('164142AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#partnerHivStatusid').selectOption('1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#tbResultStatusid').selectOption('1662AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  console.log('Checking if ANC Profile was done before enrollment...');
  await page.locator('#ancProfileid_1').check();

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
});
