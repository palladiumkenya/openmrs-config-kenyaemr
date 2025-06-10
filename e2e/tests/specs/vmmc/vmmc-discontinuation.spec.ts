import { expect } from '@playwright/test';
import {
    generateRandomPatient,
    startVisit,
    generateVmmcEnrollmentEncounter,
    generateVmmcMedicalEncounter,
    generateVmmcProcedureEncounter,
    generateVmmcPostOperationEncounter,
    generateVmmcFollowupEncounter
} from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';

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

let patient: any;
let visit: any;

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
    console.log('VMMC Medical History Encounter created:', vmmcProcedureEncounter);
    const vmmcPostOperationEncounter = await generateVmmcPostOperationEncounter(api, patient.uuid, visit.uuid,);
    console.log('VMMC Post Operation Encounter created:', vmmcPostOperationEncounter);
    const vmmcFollowupEncounter = await generateVmmcFollowupEncounter(api, patient.uuid, visit.uuid,);
    console.log('VMMC Followup Encounter created:', vmmcFollowupEncounter);
});

test('VMMC Discontinuation Form test', async ({ page }) => {
    const carePanelPage = new CarePanelPage(page);
    await test.step('When I visit care panel page', async () => {
        await carePanelPage.gotoCarePanel(patient.uuid);
        await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
        await expect(page.getByRole('tab', { name: 'VMMC' })).toBeVisible();
    });

    await test.step('And I click on the VMMC enrollment, I should see the VMMC discontinuation form', async () => {
        await page.getByRole('button', { name: 'Options' }).click();
        await expect(page.getByRole('menuitem', { name: 'Discontinue' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Discontinue' }).click();
        await expect(page.getByRole('heading', { name: 'VMMC Discontinuation Form' })).toBeVisible();
    });

    await test.step('I should be able to fill the form', async () => {
        await page.locator('#discontinueDateid').fill(getCurrentDateFormatted());
        await page.locator('#idReasonid').selectOption('162130AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
    });
});