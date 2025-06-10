import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit, generateVmmcEnrollmentEncounter, generateVmmcMedicalEncounter } from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;


const getCurrentTimeFormatted = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
});

test('VMMC Circumcision Procedure Form test', async ({ page }) => {
    const carePanelPage = new CarePanelPage(page);
    await test.step('When I visit care panel page', async () => {
        await carePanelPage.gotoCarePanel(patient.uuid);
        await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
        await expect(page.getByRole('tab', { name: 'VMMC' })).toBeVisible();
    });

    await test.step('And I click on the clinical forms, I should see the VMMC circumcission procedure form', async () => {
        const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
        await clinicalFormsButton.click();
        await expect(page.getByText('VMMC Circumcision Procedure Form')).toBeVisible();
        await page.getByText('VMMC Circumcision Procedure Form').click();
        await expect(page.getByRole('heading', { name: 'VMMC Procedure' })).toBeVisible();
    });

    await test.step('I should be able to fill the method of circumcision', async () => {
        await page.locator('#circumcisionMethodid').selectOption('167119AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#conventionalMethodid').selectOption('167121AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    });

    await test.step('I should be able to fill anaesthesia', async () => {
        await page.locator('#anaesthesiaTypeid').selectOption('161914AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#agentsid').selectOption('72505AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#concentrationid').fill('10');
        await page.locator('#volumeid').fill('50');
        await page.locator('label').filter({ hasText: /^Other Agent$/ }).click();
        await page.locator('#specifyAgentid').fill(clinicalNotes);
        const timeNow = getCurrentTimeFormatted();
        await page.locator('#timeofPlacementid').fill(timeNow);
        await page.locator('#timeofSlitid').fill(timeNow);
    });

    await test.step('I should be able to fill in adverse events', async () => {
        await page.locator('#adverseEventsid_0').check();
        await page.getByRole('button', { name: 'Add' }).nth(2).click();
        await page.locator('#adverseEventPainid').selectOption('114403AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#severityDisruptionid').selectOption('1499AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#managementid').fill(clinicalNotes);
        await page.locator('#medsGivenid_0').check();
        await page.locator('label').filter({ hasText: 'Analgesic' }).click();
        await page.locator('label').filter({ hasText: 'Antibiotics' }).click();
        await page.locator('label').filter({ hasText: 'TTCV' }).click();
        await page.locator('label').filter({ hasText: /^Other$/ }).click();
    });

    await test.step('I should be able to fill personnel in charge', async () => {
        await page.locator('#clinicianid').getByRole('textbox').fill('quality');
        await page.getByRole('option', { name: 'Quality' }).first().click();
        await page.locator('#clinicianCadreid_0').check();
        await page.locator('#assistantClinicianid').getByRole('textbox').fill('quality');
        await page.getByRole('option', { name: 'Quality' }).first().click();
        await page.locator('#assistantCadreid_0').check();
        await page.locator('#theatreNumberid').fill('VMMC01');
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
    });
});