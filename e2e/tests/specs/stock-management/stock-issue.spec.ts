import { expect, test } from '@playwright/test';
import { StockManagementPage } from '../../pages';
import { loginAndNavigateToCarePanel } from '../mch-mother-service/helpers'
import { generateOpeningStock } from '../../commands';
import { faker } from '@faker-js/faker';

const batchNumber = faker.string.alphanumeric(8);

test.beforeEach(async ({ page, playwright }) => {
    await loginAndNavigateToCarePanel(page);

    const ctx = await playwright.request.newContext({
        baseURL: `${process.env.E2E_BASE_URL}/ws/rest/v1/`,
        httpCredentials: {
            username: process.env.E2E_USER_ADMIN_USERNAME,
            password: process.env.E2E_USER_ADMIN_PASSWORD,
        },
    });

    const openingStock = await generateOpeningStock(ctx, batchNumber);
    console.log('Opening stock created:', openingStock);
});

test('Stock Issue Test', async ({ page }) => {
    const stockManagement = new StockManagementPage(page);

    await test.step('When I visit the stocks operations page', async () => {
        await stockManagement.gotoOperations();
        await expect(stockManagement.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/stock-management/operations`);
    });

    await test.step('I should see the start new operation', async () => {
        await expect(page.getByLabel('Options')).toBeVisible();
        await page.getByLabel('Options').click();
        await expect(page.getByRole('menuitem', { name: 'Requisition' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Requisition' }).click();
    });

    await test.step('I should be able to fill the requisition details', async () => {
        await page.getByPlaceholder('Choose a source').click();
        await page.getByText('Main Pharmacy', { exact: true }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();
    });

    await test.step('I should be able to fill the stock details', async () => {
        await page.getByPlaceholder('Find your items').click();
        await page.getByPlaceholder('Find your items').fill('diazepam');
        await page.locator('a').filter({ hasText: 'Diazepam Tablet 5mg' }).click();
        await page.getByLabel('Qty', { exact: true }).click();
        await page.getByLabel('Qty', { exact: true }).fill('752');
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();
    });

    await test.step('I should be able to complete the operation', async () => {
        await page.getByRole('group', { name: 'Does the transaction require' }).locator('span').nth(2).click();
        await page.getByTestId('complete-button').click();
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('When I go click the ordered requisition, I should be able to issue stock', async () => {
        await page.getByRole('row', { name: 'Expand current row Requisition Edit stock operation Diazepam Tablet 5mg' }).first().getByLabel('Expand current row').click();
        await expect(page.getByRole('button', { name: 'Issue Stock' })).toBeVisible();
        await page.getByRole('button', { name: 'Issue Stock' }).click();
    });

    await test.step('I should be able to fill the stock issue details', async () => {
        await page.getByRole('button', { name: 'Next', exact: true }).click();
        await page.getByRole('row', { name: 'Diazepam Tablet 5mg Available' }).getByRole('button').first().click();
        await page.getByRole('combobox', { name: 'Batch No' }).click();
        await page.getByText(batchNumber).click();
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByRole('button', { name: 'Next', exact: true }).click();
    });

    await test.step('I should be able to dispatch the transaction', async () => {
        await page.getByRole('group', { name: 'Does the transaction require' }).locator('span').nth(2).click();
        await page.getByTestId('dipatch-button').click();
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('I should be able to complete the dispatched transaction', async () => {
        await page.getByRole('row', { name: 'Expand current row Stock Issue Loading Diazepam Tablet 5mg DISPATCHED Main' }).getByLabel('Expand current row').click();
        await page.getByRole('button', { name: 'Complete' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('I should be able to confirm stock items transacted', async () => {
        await page.getByRole('link', { name: 'Items' }).click();
        await page.getByPlaceholder('Search stock items').click();
        await page.getByPlaceholder('Search stock items').fill('diazepam');
        await page.getByRole('button', { name: 'Diazepam Tablet 5mg' }).click();
        await page.getByRole('button', { name: 'Batch Information' }).click();
        await page.getByLabel('Open', { exact: true }).click();
        await page.getByText('Main Pharmacy').click();
        await expect(page.getByRole('row', { name: `${batchNumber} 752` })).toBeVisible();
    });
});