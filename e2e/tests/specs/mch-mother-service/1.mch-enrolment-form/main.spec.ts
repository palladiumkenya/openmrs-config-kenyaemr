import { test, expect } from '@playwright/test';

test('Kenya HMIS - MCH Form Submission', async ({ page }) => {
  // Navigate to the SPA (Single Page Application) main page
  console.log('Navigating to the OpenMRS SPA home page');
  await page.goto('https://qa.kenyahmis.org/openmrs/spa/');
  
  // Navigate to the home page
  console.log('Navigating to the OpenMRS home page');
  await page.goto('https://qa.kenyahmis.org/openmrs/spa/home');
  
  // Navigate to the login page
  console.log('Navigating to the login page');
  await page.goto('https://qa.kenyahmis.org/openmrs/spa/login');

  // Perform login
  console.log('Logging in with admin credentials');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Username').press('Enter');
  await page.getByLabel('Password').fill('Admin123');
  await page.getByLabel('Password').press('Enter');

  // Select facility
  console.log('Selecting the facility: Nyeri Provincial General');
  await page.locator('label').filter({ hasText: 'Nyeri Provincial General' }).locator('span').first().click();
  await page.getByRole('button', { name: 'Confirm' }).click();

  // Navigate to the MCH module
  console.log('Navigating to 	Jerry Daniel Jenkins');
  await page.getByRole('link', { name: 'Jerry Daniel Jenkins' }).click();

  // Open the menu and select the Care panel
  console.log('Opening menu and selecting Care panel');
  await page.getByLabel('Open menu').click();
  await page.getByRole('link', { name: 'Care panel' }).click();

  // Open the Program enrollment tab
  console.log('Opening the Program enrollment tab');
  await page.getByRole('tab', { name: 'Program enrollment' }).click();

  // Select the MCH - Mother Services program
  console.log('Selecting the MCH - Mother Services program');
  await page.getByRole('row', { name: 'MCH - Mother Services' }).getByRole('button').click();

  // Enroll patient in ANC service
  console.log('Enrolling the patient in ANC service');
  await page.getByLabel('ANC').check();
  await page.locator('#ancNumberid').click();
  await page.locator('#ancNumberid').fill('2024-12-0001');
  await page.locator('#ancNumberid').click();

  // Fill in parity details
  console.log('Filling in parity details');
  await page.locator('#parityTermid').click();
  await page.locator('#parityTermid').fill('1');
  await page.locator('#parityAbortionid').click();
  await page.locator('#parityAbortionid').fill('0');
  await page.getByRole('button', { name: 'Decrement' }).nth(3).click();

  // Fill in Last Menstrual Period (LMP) date
  console.log('Filling in the LMP date');
  await page.locator('#lmpDateid').click();
  page.locator("#lmpDateid").fill("10/10/2024"); 
  // await page.locator('#lmpDateid').click();
  await page.getByLabel('#lmpDateid').press('Enter');
  // await page.getByText('31', { exact: true }).click();
//   await page.getByLabel('30 October').getByText('30').click();

//   // Fill in ultrasound EDD
//   console.log('Filling in Ultrasound EDD');
//   await page.locator('#ultrasoundEddid').click();
//   await page.getByLabel('8 October 2024', { exact: true }).getByText('8').click();
//   await page.locator('#ultrasoundEddid').click();
//   await page.getByText('31', { exact: true }).click();
//   await page.locator('#ultrasoundEddid').click();
//   await page.getByLabel('Next month').click();
//   await page.getByLabel('1 November 2024', { exact: true }).getByText('1').click();
//   await page.locator('#ultrasoundEddid').click();
//   await page.locator('.cdk-overlay-backdrop').click();

  // Select HIV and TB status
  console.log('Selecting patient and partner HIV status, and TB result');
  await page.locator('#patientHivStatusid').selectOption('164142AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#partnerHivStatusid').selectOption('1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#tbResultStatusid').selectOption('1660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  // // Select ANC profile
  // console.log('Selecting ANC profile');
  // await page.locator('#ancProfileid_1').check();

  // // Fill in the first ANC date
  // console.log('Filling in the first ANC date');
  // await page.locator('#firstAncDateid').click();
  // await page.getByText('31', { exact: true }).click();


  // Save the form again
  console.log('Saving the form again');
  await page.getByRole('button', { name: 'Save and close' }).click();

  // Open the Panel summary tab
  console.log('Opening the Panel summary tab');
  await page.getByRole('tab', { name: 'Panel summary' }).click();

  // Discontinue the program
  console.log('Discontinuing the program');
  await page.getByRole('button', { name: 'Options' }).click();
  await page.getByRole('menuitem', { name: 'Discontinue' }).click();
  await page.locator('#DiscontinuationReasonid').selectOption('160035AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  // Save the discontinuation
  console.log('Saving the discontinuation');
  await page.getByRole('button', { name: 'Save and close' }).click();

  // Verify that the Program enrollment tab is visible again
  console.log('Navigating back to Program enrollment tab');
  await page.getByRole('tab', { name: 'Program enrollment' }).click();
});
