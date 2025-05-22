import { expect } from '@playwright/test';
import { test } from '../../core';
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
        await page.getByTestId('patientSearchBar').press('Enter');
        await expect(page.getByText('search results')).toBeVisible();

    })

    }
);
