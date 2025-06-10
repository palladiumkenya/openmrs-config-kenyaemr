import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit, generateVmmcEnrollmentEncounter, generateVmmcMedicalEncounter, generateVmmcProcedureEncounter } from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;


const getTomorrowsDateFormatted = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = tomorrow.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[tomorrow.getMonth()];
    const year = tomorrow.getFullYear();
    return `${day} ${month} ${year}`;
};

const clinicalNotes = faker.word.words(3);

test.beforeEach(async ({ page, api }) => {
    const gender = 'M';
    const age = 30; // Set the age to 30 years
    const currentYear = new Date().getFullYear();
    const birthdate = `${currentYear - age}-06-15`;

    patient = await generateRandomPatient(api, gender, birthdate);
    console.log('Patient created:', patient);
    visit = await startVisit(api, patient.uuid);
    console.log('Visit created:', visit);
    await page.waitForTimeout(1000);
    const vmmcEnrollment = await generateVmmcEnrollmentEncounter(api, patient.uuid, visit.uuid);
    console.log('Patient Enrolled:', vmmcEnrollment);
    const vmmcMedicalEncounter = await generateVmmcMedicalEncounter(api, patient.uuid, visit.uuid);
    console.log('VMMC Medical Encounter created:', vmmcMedicalEncounter);
    const vmmcProcedureEncounter = await generateVmmcProcedureEncounter(api, patient.uuid, visit.uuid,);
    console.log('VMMC Procedure Encounter created:', vmmcProcedureEncounter);
});

test('VMMC Post operation Form test', async ({ page }) => {
    const carePanelPage = new CarePanelPage(page);
    await test.step('When I visit care panel page', async () => {
        await carePanelPage.gotoCarePanel(patient.uuid);
        await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
        await expect(page.getByRole('tab', { name: 'VMMC' })).toBeVisible();
    });

    await test.step('And I click on the clinical forms, I should see the VMMC post operation form', async () => {
        const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
        await clinicalFormsButton.click();
        await expect(page.getByText('VMMC Immediate Post-Operation Assessment Form')).toBeVisible();
        await page.getByText('VMMC Immediate Post-Operation Assessment Form').click();
        await expect(page.getByRole('heading', { name: 'VMMC Immediate Post-Operation Assessment' })).toBeVisible();
    });

    await test.step('I should be able to fill the form', async () => {
        await page.locator('#systolicid').fill('120');
        await page.locator('#diastolicid').fill('80');
        await page.locator('#pulseid').fill('72');
        await page.locator('#tempid').fill('36');
        await page.locator('#penis-elevatedid_1').click();
        await page.locator('#postProcedure_instructionsid_0').click();
        await page.locator('#explaiNid').fill(clinicalNotes);
        await page.locator('#medsGivenid_0').click();
        await page.locator('label').filter({ hasText: /^Analgesic$/ }).click();
        await page.locator('label').filter({ hasText: /^Antibiotics$/ }).click();
        await page.locator('label').filter({ hasText: /^TTCV$/ }).click();
        await page.locator('label').filter({ hasText: /^Other$/ }).click();
        await page.locator('#removalDateid').fill(getTomorrowsDateFormatted());
        await page.locator('#nextVisitDateid').fill(getTomorrowsDateFormatted());
        await page.locator('#dischargedByid').getByRole('textbox').fill('quality');
        await page.getByRole('option', { name: 'Quality' }).first().click();
        await page.locator('#clinician_cadreid_0').check();
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
    });
});