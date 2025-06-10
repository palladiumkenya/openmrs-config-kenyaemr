import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit, generateVmmcEnrollmentEncounter } from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;

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
});

test('VMMC Medical History and Physical Examination Form test', async ({ page }) => {
    const carePanelPage = new CarePanelPage(page);
    await test.step('When I visit care panel page', async () => {
        await carePanelPage.gotoCarePanel(patient.uuid);
        await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
        await expect(page.getByRole('tab', { name: 'VMMC' })).toBeVisible();
    });

    await test.step('And I click on the clinical forms', async () => {
        const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
        await clinicalFormsButton.click();
        await expect(page.getByText('VMMC Medical History and Physical Examination Form')).toBeVisible();
        await page.getByText('VMMC Medical History and Physical Examination Form').click();
    });

    await test.step('When I click on yes consent is given', async () => {
        await page.locator('#consentGivenid_0').click();
        await expect(page.getByRole('button', { name: 'Knowledge of HIV Status' })).toBeVisible();
    });

    await test.step('I should be able to fill the VMMC medical history form', async () => {
        await page.locator('#patientHivStatusid').selectOption('1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#reasonUnknownid').fill(clinicalNotes);
        await page.locator('label').filter({ hasText: 'Bleeding Disorder' }).click();
        await page.locator('label').filter({ hasText: 'Diabetes' }).first().click();
        await page.locator('#ClientPreseNtComplainTid').selectOption('true');
        await expect(page.getByText('Complaints Today')).toBeVisible();
    });

    await test.step('I should be able to select the complaints', async () => {
        await page.locator('label').filter({ hasText: 'Urethral Discharge' }).click();
        await expect(page.locator('label').filter({ hasText: 'Urethral Discharge' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Genital Sore' }).click();
        await expect(page.locator('label').filter({ hasText: 'Genital Sore' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Pain on Urination' }).click();
        await expect(page.locator('label').filter({ hasText: 'Pain on Urination' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Swelling of the scrotum' }).click();
        await expect(page.locator('label').filter({ hasText: 'Swelling of the scrotum' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Difficulty in retracting foreskin' }).click();
        await expect(page.locator('label').filter({ hasText: 'Difficulty in retracting foreskin' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Difficulty in returning foreskin to normal' }).click();
        await expect(page.locator('label').filter({ hasText: 'Difficulty in returning foreskin to normal' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Concerns about erection/sexual function' }).click();
        await expect(page.locator('label').filter({ hasText: 'Concerns about erection/sexual function' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Epispadia' }).click();
        await expect(page.locator('label').filter({ hasText: 'Epispadia' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Hypospadia' }).click();
        await expect(page.locator('label').filter({ hasText: 'Hypospadia' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Others' }).click();
        await expect(page.locator('label').filter({ hasText: 'Others' })).toBeChecked();
    });

    await test.step('I should be able to fill other treatments', async () => {
        await page.locator('#uNdergoingTreatmentid_0').click();
        await expect(page.getByText('Tick all that apply')).toBeVisible();
        await page.locator('label').filter({ hasText: 'Anaemia' }).click();
        await expect(page.locator('label').filter({ hasText: 'Anaemia' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Diabetes' }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: 'Diabetes' }).nth(1)).toBeChecked();
        await page.locator('label').filter({ hasText: 'HIV/AIDS' }).click();
        await expect(page.locator('label').filter({ hasText: 'HIV/AIDS' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Other' }).nth(2).click();
        await expect(page.locator('label').filter({ hasText: 'Other' }).nth(2)).toBeChecked();
    });

    await test.step('I should be able to fill in allergies', async () => {
        await page.locator('#KnoWnAllergid_0').check();
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#AllerGyFieldid').selectOption('162171AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#reaCTIONid').selectOption('512AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#severITYid').selectOption('160754AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#DateOfOnsetid').fill(getCurrentDateFormatted());
    });

    await test.step('I should be able to fill the rest of other treatments', async () => {
        await page.locator('#prevSurgicalOperationid_0').check();
        await page.locator('#otherSurgeryid').fill(clinicalNotes);
        await page.locator('#tetanusBoosterProofid_0').check();
        await page.locator('#tetanusBoosterGivenid_0').check();
        await page.locator('#tetanusBoosterDateid').fill(getCurrentDateFormatted());
        await page.locator('#systolicBPid').fill('120');
        await page.locator('#diastolicBPid').fill('80');
        await page.locator('#pulsRateid').fill('90');
        await page.locator('#temperatureid').fill('36');
    });

    await test.step('I should be able to fill eligibility', async () => {
        await page.locator('#inGoodHealthid_0').check();
        await page.locator('#couNSElledid_0').check();
        await page.getByLabel('Conventional Surgical').check();
        await page.getByLabel('Sleeve resection').check();
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
    });
});