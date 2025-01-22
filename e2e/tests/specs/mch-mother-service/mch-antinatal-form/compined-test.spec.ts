import { test, expect, BrowserContext, Page } from '@playwright/test';
import { loginAndOpenForm } from '../helpers';

let context: BrowserContext;
let page: Page;

test.describe('MCH Antenatal Full Form Submission', () => {
  // Set up shared browser context and page before all tests
  test.beforeAll(async ({ browser }) => {
    console.log('Creating a new browser context and page');
    context = await browser.newContext();
    page = await context.newPage();

    console.log('Logging in and opening the MCH Antenatal Visit form');
    await loginAndOpenForm(page, 'Hellen Andanje Omukunde', 'MCH Antenatal Visit');
  });

  // Clean up after all tests
  test.afterAll(async () => {
    console.log('Closing the browser context');
    await context.close();
  });

  test('Main MCH ANC Test - First Visit', async () => {
   
  // Fill the visit number Decrement ANC Visit
  await page.locator('#visitNumberid').click();
  await page.locator('#visitNumberid').fill('5');
 //  await page.locator('#clinicNumberid').click();
 //  await page.locator('#clinicNumberid').fill('2024-10-29');
  await page.getByLabel('Decrement').nth(1).click();
  
 // console.log('Navigating to Patient History');
 // await page.getByRole('button', { name: 'Patient History', exact: true }).click();

 // Fill out the fields in the Patient History section
 await page.getByText('NextPatient History').click();
 await page.locator('#preConceptioncareid_1').check();
 await page.locator('label').filter({ hasText: 'None' }).first().click();
 await page.locator('label').filter({ hasText: 'Cesarean section' }).click();
 await page.locator('#fgmDoneid_1').check();
 await page.getByText('No', { exact: true }).nth(2).click();
 await page.locator('#chronicIllnessid_1').check();
 console.log('Patient History section filled successfully');
 
 console.log('Navigating to Patient Examination');
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


 console.log('Navigating to Patient Management');
 await page.getByText('NextPatient Management').click();
 await page.locator('#physicalExercisesid_1').check();
 await page.locator('ofe-form-renderer:nth-child(2) > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').first().click();
 await page.locator('#iptGivenid_1').check();
 await page.locator('ofe-form-renderer:nth-child(6) > div > .cds--layout > .cds--accordion > .cds--accordion__item > [id="accordion-item-\\:r27\\:"] > ofe-form-renderer > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').click();
 await page.locator('ofe-form-renderer:nth-child(7) > div > .cds--layout > .cds--accordion > .cds--accordion__item > [id="accordion-item-\\:r27\\:"] > ofe-form-renderer > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').click();
 await page.locator('#referredToid').selectOption('1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
 await page.locator('#reasonReferralid').click();
 await page.locator('#reasonReferralid').fill('note given');
 await page.locator('#clinicalNotesid').click();
 await page.locator('#clinicalNotesid').fill('fine now');
 await page.getByRole('button', { name: 'Save and close' }).click();

});

  test('Main MCH ANC Test - Second Visit', async () => {
   // Fill the visit number Decrement ANC Visit
  await page.locator('#visitNumberid').click();
  await page.locator('#visitNumberid').fill('5');
 //  await page.locator('#clinicNumberid').click();
 //  await page.locator('#clinicNumberid').fill('2024-10-29');
  await page.getByLabel('Decrement').nth(1).click();
  
 // console.log('Navigating to Patient History');
 // await page.getByRole('button', { name: 'Patient History', exact: true }).click();

 // Fill out the fields in the Patient History section
 await page.getByText('NextPatient History').click();
 await page.locator('#preConceptioncareid_1').check();
 await page.locator('label').filter({ hasText: 'None' }).first().click();
 await page.locator('label').filter({ hasText: 'Cesarean section' }).click();
 await page.locator('#fgmDoneid_1').check();
 await page.getByText('No', { exact: true }).nth(2).click();
 await page.locator('#chronicIllnessid_1').check();
 console.log('Patient History section filled successfully');
 
 console.log('Navigating to Patient Examination');
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


 console.log('Navigating to Patient Management');
 await page.getByText('NextPatient Management').click();
 await page.locator('#physicalExercisesid_1').check();
 await page.locator('ofe-form-renderer:nth-child(2) > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').first().click();
 await page.locator('#iptGivenid_1').check();
 await page.locator('ofe-form-renderer:nth-child(6) > div > .cds--layout > .cds--accordion > .cds--accordion__item > [id="accordion-item-\\:r27\\:"] > ofe-form-renderer > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').click();
 await page.locator('ofe-form-renderer:nth-child(7) > div > .cds--layout > .cds--accordion > .cds--accordion__item > [id="accordion-item-\\:r27\\:"] > ofe-form-renderer > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').click();
 await page.locator('#referredToid').selectOption('1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
 await page.locator('#reasonReferralid').click();
 await page.locator('#reasonReferralid').fill('note given');
 await page.locator('#clinicalNotesid').click();
 await page.locator('#clinicalNotesid').fill('fine now');
 await page.getByRole('button', { name: 'Save and close' }).click();

});

test('Main MCH ANC Test - Third Visit', async () => {
  // Fill the visit number Decrement ANC Visit
  await page.locator('#visitNumberid').click();
  await page.locator('#visitNumberid').fill('5');
 //  await page.locator('#clinicNumberid').click();
 //  await page.locator('#clinicNumberid').fill('2024-10-29');
  await page.getByLabel('Decrement').nth(1).click();
  
 // console.log('Navigating to Patient History');
 // await page.getByRole('button', { name: 'Patient History', exact: true }).click();

 // Fill out the fields in the Patient History section
 await page.getByText('NextPatient History').click();
 await page.locator('#preConceptioncareid_1').check();
 await page.locator('label').filter({ hasText: 'None' }).first().click();
 await page.locator('label').filter({ hasText: 'Cesarean section' }).click();
 await page.locator('#fgmDoneid_1').check();
 await page.getByText('No', { exact: true }).nth(2).click();
 await page.locator('#chronicIllnessid_1').check();
 console.log('Patient History section filled successfully');
 
 console.log('Navigating to Patient Examination');
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


 console.log('Navigating to Patient Management');
 await page.getByText('NextPatient Management').click();
 await page.locator('#physicalExercisesid_1').check();
 await page.locator('ofe-form-renderer:nth-child(2) > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').first().click();
 await page.locator('#iptGivenid_1').check();
 await page.locator('ofe-form-renderer:nth-child(6) > div > .cds--layout > .cds--accordion > .cds--accordion__item > [id="accordion-item-\\:r27\\:"] > ofe-form-renderer > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').click();
 await page.locator('ofe-form-renderer:nth-child(7) > div > .cds--layout > .cds--accordion > .cds--accordion__item > [id="accordion-item-\\:r27\\:"] > ofe-form-renderer > .ng-dirty > div > .question-area > .afe-control > div > .ng-untouched > .cds--fieldset > div:nth-child(2) > .form-control').click();
 await page.locator('#referredToid').selectOption('1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
 await page.locator('#reasonReferralid').click();
 await page.locator('#reasonReferralid').fill('note given');
 await page.locator('#clinicalNotesid').click();
 await page.locator('#clinicalNotesid').fill('fine now');
 await page.getByRole('button', { name: 'Save and close' }).click();


});
});
