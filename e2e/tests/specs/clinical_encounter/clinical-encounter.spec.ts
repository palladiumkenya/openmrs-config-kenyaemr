import { test } from '../../core';
import { expect } from '@playwright/test';
import { HomePage } from '../../pages';
import { faker } from '@faker-js/faker';

test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoHome();

    // Generate random name
    const firstName = faker.person.firstName();
    const middleName = faker.person.middleName();
    const lastName = faker.person.lastName();

    await page.getByLabel('Add Patient').click();
    await page.getByLabel('First Name').fill(firstName);
    await page.getByLabel('Middle Name (optional)').fill(middleName);
    await page.getByLabel('Family Name').fill(lastName);
    await page.locator('fieldset span').nth(2).click();
    await page.getByRole('tab', { name: 'No' }).click();
    await page.getByLabel('Estimated age in years').fill('25');
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
});

test('Clinical Encounter Test', async ({ page }) => {
    test.step('When I click the clinical forms button', async () => {
        await page.getByRole('button', { name: 'Clinical forms' }).click();
        await expect(page.getByLabel('forms', { exact: true }).getByText('Clinical Encounter')).toBeVisible();
    });
});