import { test } from '../../core';
import { expect } from '@playwright/test';
import { HomePage } from '../../pages';
import { faker } from '@faker-js/faker';

test('Clinical Encounter Test', async ({ page }) => {
    //login
    const homePage = new HomePage(page);
    await homePage.gotoHome();

    // Generate random name
    const firstName = faker.person.firstName();
    const middleName = faker.person.middleName();
    const lastName = faker.person.lastName();

    //create patient
    await page.getByRole('button', { name: 'Add Patient'}).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Create new patient' })).toBeVisible();
    await page.fill('#givenName', firstName);
    await page.fill('#middleName', middleName);
    await page.fill('#familyName', lastName);
    await page.locator('fieldset span').nth(2).click();
    await page.getByRole('tab', { name: 'No' }).click();
    await page.fill('#yearsEstimated', '25');
    await page.getByPlaceholder('Search address').fill('bamburi');
    await page.getByText('Mombasa > Kisauni > Bamburi').click();
    await page.getByLabel('Telephone contact').fill('0723000000');
    await page.getByLabel('Location', { exact: true }).fill('Bamburi');
    await page.getByLabel('Sub-location').fill('Bamburi');
    await page.getByLabel('Village').fill('Kiembeni');
    await page.getByLabel('Landmark').fill('Mint');
    await page.getByLabel('Nearest Health Center').fill('Bamburi Dispensary');
    await page.getByLabel('Marital status').selectOption('1057AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByLabel('Occupation').selectOption('1107AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByLabel('Education').selectOption('159785AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByRole('button', { name: 'Post to registry' }).click();
    await page.getByRole('button', { name: 'Register Patient' }).click();
    await page.getByRole('button', { name: 'Start a visit' }).click();
    await page.locator('label').filter({ hasText: 'Outpatient' }).locator('span').first().click();
    await page.getByRole('button', { name: 'Start visit' }).click();
    await expect(page.locator('button:has-text("End visit")')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    //click clinical forms
    const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
    await clinicalFormsButton.waitFor({ state: 'visible', timeout: 5000 });
    await clinicalFormsButton.click();
    await expect(page.getByText('Clinical Encounter')).toBeVisible();

    //click clinical encounter
    await page.getByText('Clinical Encounter').click();
    await expect(page.getByText('Save and close Discard')).toBeVisible();

    //click save and close
    await page.getByRole('button', { name: 'Save and close' }).click();
    //await expect(page.getByText('Visit Type? This field is required! Fix')).toBeVisible();
    await expect(page.getByText('Patient having complaint(s) today? This field is required! Fix')).toBeVisible();
    await expect(page.getByText('Patient has adverse drug reaction(s)? This field is required! Fix')).toBeVisible();
    await expect(page.getByText('General examination findings: This field is required! Fix')).toBeVisible();
    await expect(page.getByText('Finding(s) on systems review? This field is required! Fix')).toBeVisible();
   
});
