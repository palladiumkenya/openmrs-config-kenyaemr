import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit } from '../../commands';
import { test } from '../../core';
import { SummaryPage } from '../../pages';

let patient: any;
let visit: any;

test.beforeEach(async ({ api }) => {
    patient = await generateRandomPatient(api, 'F', '1999-06-15');
    console.log('Patient created:', patient);
    visit = await startVisit(api, patient.uuid);
});

test('Clinical Encounter Test', async ({ page, api }) => {
    const patientSummary = new SummaryPage(page);
    
    await test.step('When I visit the patient summary page', async () => {
        await patientSummary.gotoSummaryPage(patient.uuid);
        await expect(patientSummary.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Patient Summary`);
    });

    await test.step('And I click on the clinical forms', async () => {
        const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
        await clinicalFormsButton.waitFor({ state: 'visible', timeout: 5000 });
        await clinicalFormsButton.click();
        await expect(page.getByText('Clinical Encounter')).toBeVisible();
    });   
});