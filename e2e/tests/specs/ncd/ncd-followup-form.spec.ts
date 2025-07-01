import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit, generateNCDEnrollmentEncounter } from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';
import { fa, faker } from '@faker-js/faker';

let patient: any;
let visit: any;

test.beforeEach(async ({ api, page }) => {
    const gender = 'M';
    const age = 30; // Set the age to 30 years
    const currentYear = new Date().getFullYear();
    const birthdate = `${currentYear - age}-06-15`;

    patient = await generateRandomPatient(api, gender, birthdate);
    console.log('Patient created:', patient);
    visit = await startVisit(api, patient.uuid);
    console.log('Visit created:', visit);
    await page.waitForTimeout(1000);
    const ncdEnrollment = await generateNCDEnrollmentEncounter(api, patient.uuid, visit.uuid);
    console.log('Patient Enrolled:', ncdEnrollment);

    const carePanelPage = new CarePanelPage(page);
    await test.step('When I visit care panel page', async () => {
        await carePanelPage.gotoCarePanel(patient.uuid);
        await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
        await expect(page.getByRole('tab', { name: 'NCD' })).toBeVisible();
    });

    await test.step('And I click on the clinical forms', async () => {
        const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
        await clinicalFormsButton.click();
        await expect(page.getByText('NCD Followup Form')).toBeVisible();
    });

    await test.step('I should be able to click on the NCD Followup Form form', async () => {
        await page.getByText('NCD Followup Form').click();
        await expect(page.getByText('Save and close Discard')).toBeVisible();
    });
});

test('NCD followup test no complaints', async ({ page }) => {
    await test.step('I should be able to fill the visit details', async () => {
        await page.getByLabel('Scheduled', { exact: true }).check();
        await page.getByText('NextPatient\'s History').click();
    });

    await test.step('I should be able to fill the current lifestyle', async () => {
        await page.locator('#useTobaccoid_2').check();
        await page.locator('#alcoholDrinkid_2').check();
        await page.locator('#physicalActivityid_0').check();
        await page.locator('#dietHealthyid_0').check();
        await page.locator('#havingComplicationsid_1').check();
        await page.getByText('NextPatient\'s Examination').click();
    });

    await test.step('I should be able to fill patient examination section', async () => {
        await page.locator('label').filter({ hasText: 'None' }).click();
        await expect(page.locator('label').filter({ hasText: 'Cyanosis' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Dehydration' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Finger Clubbing' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Jaundice' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Lethargic' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Lymph Node Axillary' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Lymph Nodes Inguinal' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Nasal Flaring' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Oedema' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Oral thrush' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Pallor' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Convulsions' })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: 'Wasting' })).toBeDisabled();

        await page.locator('#cardioVascularid_0').check();
        await page.locator('#resPiratoryid_0').check();
        await page.locator('#abdominalPelvicid_0').check();
        await page.locator('#neurologicalExamid_0').check();
        await page.locator('#examOralid_0').check();

        await page.locator('#footExamid div').first().click();
        await page.getByRole('option', { name: 'Ulcers' }).click();
        await page.getByLabel('No', { exact: true }).check();

        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#DiagNosISid').getByRole('textbox').click();
        await page.locator('#DiagNosISid').getByRole('textbox').fill('hypertension');
        await page.getByText('hypertension').first().click();

        await page.locator('#clinicNotesCompsid').fill(faker.lorem.sentence());
        await page.getByText('NextPatient\'s Management').click();
    });

    await test.step('I should be able to fill patient management', async () => {
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#DiagNosISid div').nth(1).click();
        await page.locator('#DiagNosISid').getByRole('textbox').fill('hypertension');
        await page.getByText('hypertension').first().click();

        await page.locator('#adherenceid_0').check();
        await page.locator('#transferOutid_0').check();
        await page.locator('#facilityNameid').click();
        await page.locator('#facilityNameid').fill('Bamburi');
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted successfully/i)).toBeVisible();
    });
});

test('NCD followup test complaints', async ({ page }) => {
    await test.step('I should be able to fill the visit details', async () => {
        await page.getByLabel('Scheduled', { exact: true }).check();
        await page.getByText('NextPatient\'s History').click();
    });

    await test.step('I should be able to fill the current lifestyle', async () => {
        await page.locator('#useTobaccoid_2').check();
        await page.locator('#alcoholDrinkid_2').check();
        await page.locator('#physicalActivityid_0').check();
        await page.locator('#dietHealthyid_0').check();
        await page.locator('#havingComplicationsid_0').check();
        await page.getByRole('textbox').click();
        await page.getByRole('option', { name: 'Stroke' }).click();
        await page.getByText('NextPatient\'s Examination').click();
    });

    await test.step('I should be able to fill patient examination section', async () => {
        await page.locator('label').filter({ hasText: 'Cyanosis' }).click();
        await page.locator('label').filter({ hasText: 'Dehydration' }).click();
        await page.locator('label').filter({ hasText: 'Finger Clubbing' }).click();
        await page.locator('label').filter({ hasText: 'Jaundice' }).click();
        await page.locator('label').filter({ hasText: 'Lethargic' }).click();
        await page.locator('label').filter({ hasText: 'Lymph Node Axillary' }).click();
        await page.locator('label').filter({ hasText: 'Lymph Nodes Inguinal' }).click();
        await page.locator('label').filter({ hasText: 'Nasal Flaring' }).click();
        await page.locator('label').filter({ hasText: 'Oedema' }).click();
        await page.locator('label').filter({ hasText: 'Oral thrush' }).click();
        await page.locator('label').filter({ hasText: 'Pallor' }).click();
        await page.locator('label').filter({ hasText: 'Convulsions' }).click();
        await page.locator('label').filter({ hasText: 'Wasting' }).click();

        await page.locator('#cardioVascularid_1').check();
        await page.locator('#CadioDescid').fill(faker.lorem.sentence());
        await page.locator('#resPiratoryid_1').check();
        await page.locator('#resPiratoryDescid').fill(faker.lorem.sentence());
        await page.locator('#abdominalPelvicid_1').check();
        await page.locator('#pelvicDescriptionid').fill(faker.lorem.sentence());
        await page.locator('#neurologicalExamid_1').check();
        await page.locator('#neurologicalDescid').fill(faker.lorem.sentence());
        await page.locator('#examOralid_1').check();
        await page.locator('#oRalDescpid').fill(faker.lorem.sentence());

        await page.locator('#footExamid div').first().click();
        await page.getByRole('option', { name: 'Ulcers' }).click();

        await page.getByLabel('Yes').check();
        await page.locator('label').filter({ hasText: 'Loss of sensation' }).click();
        await page.locator('label').filter({ hasText: 'Absent pulses' }).click();
        await page.locator('label').filter({ hasText: 'Foot deformity' }).click();
        await page.locator('label').filter({ hasText: 'History of ulcer' }).click();
        await page.locator('label').filter({ hasText: 'Prior amputation' }).click();
        await page.getByLabel('Low Risk').check();

        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#DiagNosISid').getByRole('textbox').click();
        await page.locator('#DiagNosISid').getByRole('textbox').fill('hypertension');
        await page.getByText('hypertension').first().click();

        await page.locator('#clinicNotesCompsid').fill(faker.lorem.sentence());
        await page.getByText('NextPatient\'s Management').click();
    });

    await test.step('I should be able to fill patient management', async () => {
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#DiagNosISid div').nth(1).click();
        await page.locator('#DiagNosISid').getByRole('textbox').fill('hypertension');
        await page.getByText('hypertension').first().click();

        await page.locator('#adherenceid_0').check();
        await page.locator('#transferOutid_1').check();
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted successfully/i)).toBeVisible();
    });
});