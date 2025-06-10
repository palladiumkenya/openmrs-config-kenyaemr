import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit } from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';

let patient: any;
let visit: any;

test.beforeEach(async ({ api }) => {
    const gender = 'M';
    const age = 30; // Set the age to 30 years
    const currentYear = new Date().getFullYear();
    const birthdate = `${currentYear - age}-06-15`;

    patient = await generateRandomPatient(api, gender, birthdate);
    console.log('Patient created:', patient);
    visit = await startVisit(api, patient.uuid);
});

test('VMMC enrollment test', async ({ page }) => {
    const carePanelPage = new CarePanelPage(page);

    await test.step('When I visit care panel page', async () => {
        await carePanelPage.gotoCarePanel(patient.uuid);
        await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
        await expect(page.getByRole('tab', { name: 'Program enrollment' })).toBeVisible();
    });

    await test.step('I should be able to see the VMMC program', async () => {
        await page.getByRole('tab', { name: 'Program enrollment' }).click();
        await page.getByRole('row', { name: 'VMMC Eligible Enroll' }).getByRole('button').click();
    });

    await test.step('I should be able to fill the enrollment form', async () => {
        await page.locator('#referralByid').selectOption('165650AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#clientTypeid').selectOption('164144AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#informationSourceid').selectOption('1555AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#countyid').fill('Homa Bay');
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/Patient has been enrolled successfully/i)).toBeVisible();
    });
});