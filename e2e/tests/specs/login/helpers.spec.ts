import { Page, expect } from '@playwright/test';

/**
 * Logs into the OpenMRS system and navigates to a specific form for a given patient.
 * @param {Page} page - Playwright page instance.
 * @param {string} patientName - Name of the patient to select.
 * @param {string} formName - Name of the form to open.
 */
export async function loginAndOpenForm(page: Page, patientName: string, formName: string) {
  console.log(`Navigating to login page`);
  await page.goto('https://qa.kenyahmis.org/openmrs/spa/login');

  console.log(`Entering username`);
  await page.getByLabel('Username').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();

  console.log(`Entering password`);
  await page.getByLabel('Password').fill('Admin123');
  await page.getByLabel('Password').press('Enter');

  // Ensure login is successful
  await page.waitForURL('**/openmrs/spa/home', { timeout: 10000 });

  console.log(`Selecting patient: ${patientName}`);
  await page.getByRole('link', { name: patientName }).click();

  console.log(`Navigating to Clinical Forms`);
  await page.getByLabel('Clinical forms').click();

  console.log(`Opening form: ${formName}`);
  await page.getByRole('cell', { name: formName }).click();
  await page.getByText(formName).click();
}

// import { Page } from '@playwright/test';

// export async function loginAndOpenForm(page: Page, patientName: string, formName: string) {
//   console.log('Navigating to the OpenMRS login page');
//   await page.goto('https://qa.kenyahmis.org/openmrs/spa/login');

//   // Step 2: Fill the Username field with 'admin'
//   console.log('Filling the Username');
//   await page.getByLabel('Username').click();
//   await page.getByLabel('Username').fill('admin');
//   await page.getByRole('button', { name: 'Continue' }).click();

//   // Step 3: Fill the Password field with 'Admin123'
//   console.log('Waiting for the Password field to be visible');
//   await page.waitForSelector('input[type="password"]', { state: 'visible', timeout: 15000 });
//   console.log('Filling the Password');
//   await page.getByLabel('Password').fill('Admin123');

//   // Step 4: Submit login
//   console.log('Submitting the login form');
//   await page.getByLabel('Password').press('Enter');

//   // Step 5: Select the health center (e.g., 'Isinya Health Centre')
//   console.log('Selecting Login Location');
//   await page.locator('label').filter({ hasText: 'Nyeri Provincial General' }).locator('span').first().click();

//   // Step 6: Confirm health center selection
//   console.log('Confirming health center selection');
//   await page.getByRole('button', { name: 'Confirm' }).click();

//   // Step 7: Select the patient
//   console.log(`Selecting patient ${patientName}`);
//   await page.getByRole('link', { name: patientName }).click();

//   // Step 8: Click 'End visit' if there's an ongoing visit
// // console.log('Ending the previous visit if it exists');
// // try {
// //   await page.waitForSelector('label:has-text("End visit")', { timeout: 5000 });
// //   await page.getByLabel('End visit').click();
// //   console.log('Confirming end visit');
// //   await page.getByRole('button', { name: 'danger End Visit' }).click();
// // } catch (error) {
// //   console.log('No active visit found to end.');
// // }

//  console.log('Ending the visit');
//  await page.getByLabel('Check out').click();
//  await page.waitForSelector('button:has-text("Check out")', { state: 'visible', timeout: 15000 });
//   // Step 10: Confirm ending the visit
//   console.log('Confirming end visit');
//   await page.getByRole('button', { name: 'danger End Visit' }).click();
  
//   //Step 9: Start a new visit
//   console.log('Starting a new visit');
//   await page.getByLabel('Check in').click();

//   // Step 10: Select 'Outpatient' as the visit type
//   console.log('Selecting Outpatient visit type');
//   await page.locator('label').filter({ hasText: 'Outpatient' }).locator('span').first().click();

//   // Step 11: Confirm starting the visit and wait for the confirmation
//   console.log('Confirming start of visit');
//   await page.locator('form').getByRole('button', { name: 'Check in' }).click();
 
  
//   // Step 12: Open Clinical forms
//   console.log('Opening Clinical forms');
//   await page.waitForTimeout(5000); // Wait for 2 seconds
//   await page.getByLabel('Clinical forms').click();

//   // Step 13: Wait for the specific form cell to appear and click it
//   console.log(`Waiting for "${formName}" form cell to be visible`);
//   await page.waitForSelector(`text="${formName}"`, { state: 'visible', timeout: 60000 });

//   console.log(`Clicking the "${formName}" form cell`);
//   await page.getByText(formName).click();

//   console.log(`Selecting "${formName}" form`);
// }
