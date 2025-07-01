import { expect, test } from '@playwright/test';
import { StockManagementPage } from '../../pages';
import { loginAndNavigateToCarePanel } from '../mch-mother-service/helpers'
import { faker } from '@faker-js/faker';

const batchNumber = faker.string.alphanumeric(8);

const getFutureDateFormatted = (): string => {
    const today = new Date();

    const day = today.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[today.getMonth()];  // Get month name
    const year = today.getFullYear() + 2;

    return `${day} ${month} ${year}`;
};

test('Opening Stock Test', async ({ page }) => {
    await loginAndNavigateToCarePanel(page);

    const stockManagement = new StockManagementPage(page);

    await test.step('When I visit the stocks operations page', async () => {
        await stockManagement.gotoOperations();
        await expect(stockManagement.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/stock-management/operations`);
    });

    await test.step('I should see the start new operation', async () => {
        await expect(page.getByLabel('Options')).toBeVisible();
        await page.getByLabel('Options').click();
        await expect(page.getByRole('menuitem', { name: 'Opening Stock' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Opening Stock' }).click();
    });

    await test.step('I should be able to fill stock operation details', async () => {
        await page.getByPlaceholder('Choose a location').click();
        await page.getByRole('option', { name: 'Main Store' }).locator('div').click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();
    });

    await test.step('I should be able to fill the stock items details', async () => {
        await page.getByPlaceholder('Find your items').click();
        await page.getByPlaceholder('Find your items').fill('diazepam');
        await page.locator('a').filter({ hasText: 'Diazepam Tablet 5mg' }).click();
        await page.getByPlaceholder('Batch Number').click();
        await page.getByPlaceholder('Batch Number').fill(batchNumber);
        const epiryDate = getFutureDateFormatted();
        await page.locator('#expiration-input').fill(epiryDate);
        await page.getByLabel('Qty', { exact: true }).click();
        await page.getByLabel('Qty', { exact: true }).fill('7752');
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();
    });

    await test.step('I should be able to complete the transactions', async () => {
        await page.getByRole('group', { name: 'Does the transaction require' }).locator('span').nth(2).click();
        await page.getByTestId('complete-button').click();
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('When I navigate to the stock item I just added', async () => {
        await stockManagement.gotoItems();
        await expect(stockManagement.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/stock-management/items`);
        await page.getByPlaceholder('Search stock items').click();
        await page.getByPlaceholder('Search stock items').fill('diazepam');
        await page.getByRole('button', { name: 'Diazepam Tablet 5mg' }).click();
    });
    
    await test.step('I should be able to see the amout transacted', async () => {
        await page.getByRole('button', { name: 'Batch Information' }).click();
        await page.getByPlaceholder('Filter by Location').click();
        await page.getByRole('option', { name: 'Main Store' }).locator('div').click();
        let row = page.locator('table tr', { hasText: batchNumber });
        if (!(await row.isVisible())) {
            await page.getByLabel('KenyaEMR Modules').click();
            await page.getByRole('button', { name: 'Clear Cache' }).click();
            // Go back to step 66: navigate to the stock item again
            await stockManagement.gotoItems();
            await expect(stockManagement.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/stock-management/items`);
            await page.getByPlaceholder('Search stock items').click();
            await page.getByPlaceholder('Search stock items').fill('diazepam');
            await page.getByRole('button', { name: 'Diazepam Tablet 5mg' }).click();
            await page.getByRole('button', { name: 'Batch Information' }).click();
            await page.getByPlaceholder('Filter by Location').click();
            await page.getByRole('option', { name: 'Main Store' }).locator('div').click();
            row = page.locator('table tr', { hasText: batchNumber });
        }
        await expect(row).toBeVisible();
    });
});