import { Page } from '@playwright/test';

/**
 * Logs into the system and navigates to the patient care panel.
 * @param {Page} page - Playwright page instance.
 * @param {string} patientId - Patient ID to navigate to their profile.
 */
export async function loginAndNavigateToCarePanel(page: Page, patientId: string) {
  console.log(`Navigating to login page`);
  await page.goto('https://dmi.kenyahmis.org/openmrs/spa/login');

  console.log(`Logging in with username and password`);
  await page.getByLabel('Username').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Password').fill('Admin123');
  await page.getByRole('button', { name: 'Log in' }).click();

  // Close notification if it appears
  try {
    await page.getByLabel('close notification').click();
  } catch {}

  console.log(`Navigating to patient care panel`);
  await page.goto(`https://dmi.kenyahmis.org/openmrs/spa/patient/${patientId}/chart/Care%20panel`);

   // Close notification if it appears
   try {
    await page.getByLabel('close notification').click();
  } catch {}

}

/**
 * Opens the specified form from the Care Panel, Program Enrollment, or Clinical Forms for the patient.
 * @param {Page} page - Playwright page instance.
 * @param {string} formName - The name of the form to open.
 */
export async function openForm(page: Page, formName: string) {
  console.log(`Opening form: ${formName}`);

  const carePanelForms = ["CPM", "GBV", "MAT", "NCD", "TB", "TPT", "MCH - Mother Services", "KVP", "PREP"];

  if (carePanelForms.includes(formName)) {
    console.log(`Enrollment form detected. Opening ${formName} from Care Panel`);
    await page.getByRole('tab', { name: 'Program enrollment' }).click();
    
    // Find the program row dynamically (Assuming the row contains the form name)
    const programRow = await page.getByRole('row', { name: new RegExp(formName, 'i') });
    await programRow.getByRole('button').click();

    // await page.getByRole('row', { name: formName }).getByRole('button').click();
  } else if (formName.toLowerCase().includes('enrollment')) {
    console.log('Enrollment form detected. Navigating through Program Enrollment.');
    // await page.getByRole('link', { name: 'Care panel' }).click();
    await page.getByRole('tab', { name: 'Program enrollment' }).click();
    await page.getByRole('row', { name: formName }).getByRole('button').click();
  } else {
    console.log(`Opening ${formName} from Clinical Forms`);
    await page.getByLabel('Clinical forms').click();
    await page.getByText(formName, { exact: true }).click();
  }
}
