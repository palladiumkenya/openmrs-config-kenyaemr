import { test, expect } from '@playwright/test';
import {HomePage} from "../../pages";




let name = "James";
test(`Searching client with  name \`${name}`, async ({page}) => {
    const home = new HomePage(page);

    await test.step("Once navigates to homepage", async () => {
        await home.gotoHome();
        await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/home`);
        await expect(page.getByTestId('searchPatientIcon')).toBeVisible();
    });
    await test.step("Search clients by name", async ()=>{
        await page.getByTestId('searchPatientIcon').click();
        await page.getByTestId('patientSearchBar').fill(`${name}`);

    })

    }
);


// test('test', async ({ page }) => {
//     await page.goto('https://qa.kenyahmis.org/openmrs/spa/login');
//     await page.getByLabel('Username').click();
//     await page.getByLabel('Username').fill('admin');
//     await page.getByLabel('Username').press('Enter');
//     await page.getByLabel('Password').fill('Admin123');
//     await page.getByLabel('Password').press('Enter');
//     await page.getByTestId('searchPatientIcon').click();
//     await page.getByTestId('patientSearchBar').fill('test');
// });