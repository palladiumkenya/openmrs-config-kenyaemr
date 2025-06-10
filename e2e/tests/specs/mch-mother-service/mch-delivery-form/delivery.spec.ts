import { expect, Page } from '@playwright/test';
import { test } from '../../../core';
import { generateRandomPatient, startVisit, generateMCHEnrollmentEncounter } from '../../../commands';
import { loginAndNavigateToCarePanel, openForm } from '../helpers';
import { CarePanelPage } from '../../../pages';

let patient: any;
let visit: any;

const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 280); // 40 weeks = 280 days
  const day = pastDate.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[pastDate.getMonth()];  // Get month name
  const year = pastDate.getFullYear();

  return `${day} ${month} ${year}`;
};

test('Fill Patient MCH Delivery Form', async ({ page, api }) => {
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

  const formName = 'MCH Delivery Form';

  console.log('Logging in and navigating to Care Panel...');
  const carePanelPage = new CarePanelPage(page);
  await carePanelPage.gotoCarePanel(patient.uuid);
  console.log('Successfully navigated to Care Panel');

  // Open the correct form
  await openForm(page, formName);

  // // Close notification if it appears
  // try {
  //   await page.getByLabel('close notification').click();
  // } catch { }

  // Fill form fields
  console.log('Filling MCH Delivery Form');
  await page.locator('#admNumberid').fill('1');
  await page.locator('#noOfAncVisitsid').fill('1');

  console.log('Navigating to Patient History');
  await page.getByText('NextPatient History').click();

  // Directly insert the date instead of using the date picker
  console.log('Filling LMP Date');
  await page.locator('#lastLmpDateid').fill(getCurrentDateFormatted()); // Adjust field ID if needed
  await page.locator('#durationOfLabourid').fill('2'); // Adjust field ID if needed

  console.log('Selecting Delivery Mode');
  await page.locator('#deliveryModeid').selectOption([
    '1171AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    '1172AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  ]);

  await page.locator('#deliveryDateTimeid').fill(getCurrentDateFormatted() + ' 23:59');
  await page.locator('#placeOfDeliveryid').selectOption('1589AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#deliveryConductedByid').fill('Midwife');
  await page.locator('#deliveryFaciliTyid').selectOption('1578AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  console.log('Navigating to Patient Examination');
  await page.getByRole('button', { name: 'Patient Examination', exact: true }).click();

  // Directly set another date
  console.log('Setting Date & Time');
  await page.getByPlaceholder('dd/mm/yyyy hh:mm').fill(getCurrentDateFormatted() + ' 23:59');
  await page.locator('#placentaCompleteid_0').check();

  await page.locator('#plaCenTAGid').fill('10');
  await page.locator('#bloodLossCSid').fill('10');
  await page.locator('#perIneUmExamid').selectOption('164899AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#rePairpeRiniumid_0').click();
  await page.locator('#repaIrByid').fill('Midwife');
  await page.locator('#maternalOutcomeid').selectOption('160429AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#deliveryComplicationsid_0').click();
  await page.locator('#specificComplicationsid').selectOption('230AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
  await page.locator('#deliveryOutcomeid').selectOption('159913AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  await page.locator('#eligibleTestid_1').click();
  await page.locator('#partnerTestedid_0').click();
  await page.locator('#partnerHivStatusid').selectOption('664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

  console.log('Navigating to Patient Management');
  await page.getByRole('button', { name: 'Patient Management', exact: true }).click();
  await page.getByRole('radio', { name: 'None' }).check();

  await page.locator('#resuscitationid_1').click();
  await page.locator('#StiMulationdOneid_1').click();
  await page.locator('#SuctIonDOneid_1').click();
  await page.locator('#OxyGenDOneid_1').click();
  await page.locator('#BGprovidedid_1').click();
  await page.locator('#iNductIonprovidedid_1').click();
  await page.locator('#ARMprovidedid_1').click();

  console.log('Completing Management Section');
  // await page.locator('fieldset').filter({ hasText: 'Yes No N/A' }).locator('label').first().click();
  await page.locator('#vitaminKid_0').check();
  await page.locator('#babyTEOAtBirthid_0').check();
  await page.locator('#infantFeedingid_0').click();
  await page.locator('#clinicalNotesid').fill('Healthy living');


  await page.getByRole('button', { name: 'Save and close' }).click();
  // Check for validation errors (specifically "This field is required!" text)
  const requiredFieldError = await page.locator('text="This field is required!"').count();


  // Fail the test if any "This field is required!" error is found
  if (requiredFieldError > 0) {
    console.error(`⚠️ Form contains ${requiredFieldError} required field(s) missing!`);

    // Capture and log the fields with the "This field is required!" message
    const errorText = await page.locator('text="This field is required!"').allTextContents();
    console.log('Validation errors:', errorText.join('\n'));
    // await page.waitForTimeout(50000)

    expect(requiredFieldError).toBe(0); // Fail the test if there are validation errors
     // Stop execution if validation errors are found
  }
  console.log('Form submitted successfully!');

});
