import { test } from '../../core';
import { expect } from '@playwright/test';
import { HomePage, SummaryPage } from '../../pages';
import { generateRandomPatient, startVisit } from '../../commands';

test('Test to make Patient Deceased', async ({ page,api }) => {
    let patient: any;
    let gender = 'F'; 
    let age = 25;
    const currentYear = new Date().getFullYear();
    const birthdate = `${currentYear - age}-06-15`;

    patient = await generateRandomPatient(api, gender, birthdate);

    const patientSummary = new SummaryPage(page);
    
    await test.step('When I visit the patient summary page', async () => {
        await patientSummary.gotoSummaryPage(patient.uuid);
        await expect(patientSummary.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Patient Summary`);
    });


    await test.step('When I click actions button', async () => {
        await page.getByRole('button', { name: 'Actions' }).click();
        await page.getByRole('menuitem', { name: 'Mark patient deceased' }).click();
        await page.getByPlaceholder('Search for a cause of death').click();
        await page.locator('label').filter({ hasText: 'Human immunodeficiency virus disease resulting in other specified diseases' }).locator('span').first().click();
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByRole('button', { name: 'Save and close' })).not.toBeVisible();
        await expect(page.getByRole('button', { name: 'Deceased' })).toBeVisible();
    })
});
