import { expect } from '@playwright/test';
import {
    generateRandomPatient,
    startVisit,
    generateVmmcEnrollmentEncounter,
    generateVmmcMedicalEncounter,
    generateVmmcProcedureEncounter,
    generateVmmcPostOperationEncounter
} from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;

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
    console.log('VMMC Medical History Encounter created:', vmmcProcedureEncounter);
    const vmmcPostOperationEncounter = await generateVmmcPostOperationEncounter(api, patient.uuid, visit.uuid,);
    console.log('VMMC Post Operation Encounter created:', vmmcPostOperationEncounter);
});

test('VMMC Client Followup Form test', async ({ page }) => {
    const carePanelPage = new CarePanelPage(page);
    await test.step('When I visit care panel page', async () => {
        await carePanelPage.gotoCarePanel(patient.uuid);
        await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
        await expect(page.getByRole('tab', { name: 'VMMC' })).toBeVisible();
    });

    await test.step('And I click on the clinical forms, I should see the VMMC client followup form', async () => {
        const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
        await clinicalFormsButton.click();
        await expect(page.getByText('VMMC Client Follow-Up Form')).toBeVisible();
        await page.getByText('VMMC Client Follow-Up Form').click();
        await expect(page.getByRole('heading', { name: 'VMMC Client Follow-Up Form' })).toBeVisible();
    });

    await test.step('I should be able to fill the form', async () => {
        await page.locator('#ViSITtyPEid').selectOption('1246AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#adverseEventsid').selectOption('1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#adverseEventPainid').selectOption('114403AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#severityDisruptionid').selectOption('1499AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#managementid').fill(clinicalNotes);
        await page.locator('#medsGivenid').selectOption('1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('label').filter({ hasText: 'Analgesic' }).click();
        await page.locator('label').filter({ hasText: 'Antibiotics' }).click();
        await page.locator('label').filter({ hasText: 'TTCV' }).click();
        await page.locator('label').filter({ hasText: 'Other' }).click();
        await page.locator('#DischargedByWhoid').fill(clinicalNotes);
        await page.locator('#CadreDisChargingid_0').click();
        await page.locator('#cLinicalNotesid').fill(clinicalNotes);
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
    });
});