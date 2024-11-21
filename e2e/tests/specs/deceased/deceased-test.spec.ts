import { test } from '../../core';
import { expect } from '@playwright/test';
import { HomePage } from '../../pages';
function getRandomNumber(max) {
    // Returns a random number between 1 and max (inclusive)
    return Math.floor(Math.random() * max) + 1;
}
test('Test to make Patient Deceased', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('When I visit the home page', async () => {
        await homePage.gotoHome();
        await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
    });
    await test.step('When I visit the registration page', async () => {
        await page.getByTestId('searchPatientIcon').click();
        await page.getByTestId('patientSearchBar').fill('james');
        await await page.waitForTimeout(3000); // Wait for 2 seconds
        const results = await page.getByText('search results');
        const statsText = await results.textContent();
        const matches = statsText.match(/[\d,]+/);
        const resultCount = matches ? matches[0] : 'Not found';
        const number = getRandomNumber(10)
        await page.getByRole('link').nth(number).click();
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
