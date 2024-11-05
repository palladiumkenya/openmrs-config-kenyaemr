import {expect} from '@playwright/test';
import {test} from '../../core';
import {type PatientRegistrationFormValues, RegistrationAndEditPage} from '../../pages';
import {deletePatient} from '../../commands';

let patientUuid: string;
let national_id = Math.floor(Math.random() * 1000000000);
test('Register a new patient', async ({page}) => {
    test.setTimeout(5 * 60 * 1000);
    const patientRegistrationPage = new RegistrationAndEditPage(page);

    const formValues: PatientRegistrationFormValues = {
        givenName: 'James',
        middleName: 'Doe',
        familyName: 'Test',
        nationalID: `${national_id}`,
        sex: 'male',
        birthdate: {day: '01', month: '02', year: '1990'},
        county: 'Baringo',
        subCounty: 'BaringoNorth',
        ward: 'Barwessa',
        phone: '0755551234',
        postal_address: '12310230',
        email: "test@email.com",
        location: 'testLocation',
        sublocation: 'testSublocation',
        village: 'testVillage',
        landMark: 'testLandmark',
        healthCentre: 'testHealthcentre',
        maritalStatus: '159715AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        occupation: '1540AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        education: "1714AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        nextOfkinName: 'test nextkin',
        nextOfKinRelationship: '',
        nextOfKinNumber: '0700000000',
        nextOfkinPostalAddres: '',

    };

    await test.step('When I visit the registration page', async () => {
        await patientRegistrationPage.goto();
        await patientRegistrationPage.waitUntilTheFormIsLoaded();
        await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient-registration`);
    });
    await test.step("then I should be able to view post to registry", async () => {
        await page.getByRole('heading', {name: 'Client verification with'}).isVisible()
    })
    await test.step('And then I fill the registration form with the data in `formValues` and then click the `Submit` button', async () => {
        await patientRegistrationPage.fillPatientRegistrationForm(formValues);
    });

    await test.step('Then I should see a success notification', async () => {
        await expect(page.getByText(/new patient created/i)).toBeVisible();
    });

    await test.step("And I should be redirected to the new patient's chart page", async () => {
        const patientChartUrlRegex = new RegExp('^[\\w\\d:\\/.-]+\\/patient\\/[\\w\\d-]+\\/chart\\/.*$');
        await page.waitForURL(patientChartUrlRegex);
        await expect(page).toHaveURL(patientChartUrlRegex);
    });

    await test.step("And I should see the newly registered patient's details displayed in the patient banner", async () => {
        const patientBanner = page.locator('header[aria-label="patient banner"]');

        await expect(patientBanner).toBeVisible();
        await expect(patientBanner.getByText('James Doe Test')).toBeVisible();
        await expect(patientBanner.getByText(/male/i)).toBeVisible();
        await expect(patientBanner.getByText(/01 — Feb — 1990/i)).toBeVisible();
        await expect(patientBanner.getByText(/OpenMRS ID/i)).toBeVisible();
    });

    await test.step('And when I click the `Show details` button in the patient banner', async () => {
        await page
            .getByLabel('patient banner')
            .getByRole('button', {name: /show details/i})
            .click();
    });

    await test.step("Then I should see the patient's address and contact details displayed in the patient banner", async () => {
        const patientBanner = page.locator('header[aria-label="patient banner"]');

        await expect(patientBanner.getByRole('button', {name: /hide details/i})).toBeVisible();
        await expect(patientBanner.getByText(/^address$/i)).toBeVisible();
        await expect(patientBanner.getByText(/postal Address: 12310230/i)).toBeVisible();
        await expect(patientBanner.getByText('Village: testVillage')).toBeVisible();
        await expect(patientBanner.getByText('Sub-location: testSublocation')).toBeVisible();
        await expect(patientBanner.getByText('Village: testVillage')).toBeVisible();
        await expect(patientBanner.getByText(/contact details/i)).toBeVisible();
        await expect(patientBanner.getByText(/Telephone contact: 0755551234/i)).toBeVisible();
    });
});


test('Registering Client with unkown Birth date', async ({page}) => {
    test.setTimeout(5 * 60 * 1000);
    await test.step('When I visit the registration page', async () => {
        const patientRegistrationPage = new RegistrationAndEditPage(page)
        await patientRegistrationPage.goto();
        await patientRegistrationPage.waitUntilTheFormIsLoaded();
        await expect(page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient-registration`);
    });
    await test.step("Entering Basic info", async () => {
        await page.getByLabel('First Name').click();
        await page.getByLabel('First Name').fill('James');
        await page.getByLabel('Middle Name (optional)').click();
        await page.getByLabel('Middle Name (optional)').fill('Deivin');
        await page.getByLabel('Family Name').click();
        await page.getByLabel('Family Name').fill('DOE');
        await page.getByText('Female').click();
        await page.getByRole('tab', {name: 'No'}).click();
        await page.getByLabel('Estimated age in years').click();
        await page.getByLabel('Estimated age in years').fill('24');
        await page.getByLabel('Estimated age in months').click();
        await page.getByLabel('Estimated age in months').fill('1');
        await page.getByLabel('National ID (optional)').click();
        await page.getByLabel('National ID (optional)').fill(`${national_id}`);
    });
    await test.step("Entering Contact and demographics data", async () => {
        await page.getByPlaceholder('Search address').click();
        await page.getByPlaceholder('Search address').fill('ba');
        await page.getByText('Homa bay > Homa Bay Town > Homa Bay West').click();
        await page.getByLabel('Telephone contact').click();
        await page.getByLabel('Telephone contact').fill('079965262');
        await page.getByLabel('Alternate phone number (').click();
        await page.getByLabel('Alternate phone number (').fill('0799659232');
        await page.getByLabel('Contact Details Section').getByLabel('Postal Address (optional)').click();
        await page.getByLabel('Contact Details Section').getByLabel('Postal Address (optional)').fill('9083');
        await page.getByLabel('Email address (optional)').click();
        await page.getByLabel('Email address (optional)').fill('test@gmail.com');
        await page.getByLabel('Location', {exact: true}).click();
        await page.getByLabel('Location', {exact: true}).fill('Test-location');
        await page.getByLabel('Sub-location').click();
        await page.getByLabel('Sub-location').fill('test-village');
        await page.getByLabel('Village').click();
        await page.getByLabel('Village').fill('mera-village');
        await page.getByLabel('Landmark').click();
        await page.getByLabel('Landmark').fill('uis');
        await page.getByLabel('Marital status').selectOption('5555AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.getByLabel('Occupation').selectOption('1539AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.getByLabel('Education').selectOption('1714AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.getByLabel('Name (optional)', {exact: true}).click();
        await page.getByLabel('Name (optional)', {exact: true}).fill('mike');
        await page.getByLabel('Relationship (optional)').click();
        await page.getByLabel('Relationship (optional)').fill('wifue');
        await page.getByLabel('Phone Number (optional)', {exact: true}).click();
        await page.getByLabel('Phone Number (optional)', {exact: true}).fill('0712345678');
        await page.getByLabel('Next of Kin Details Section').getByLabel('Postal Address (optional)').click();
        await page.getByLabel('Next of Kin Details Section').getByLabel('Postal Address (optional)').fill('8929');
        await page.getByRole('button', {name: 'Post to registry'}).click();
        await page.getByLabel('Telephone contact').click();
        await page.getByLabel('Telephone contact').fill('0799652623');
        await page.getByRole('button', {name: 'Register Patient'}).click();
        await page.getByLabel('Nearest Health Center').fill('rtt');
        // await page.getByRole('button', { name: 'Post to registry' }).click();
        await page.getByRole('button', {name: 'Register Patient'}).click();
    });
    await test.step('Then I should see a success notification', async () => {
        await expect(page.getByText(/new patient created/i)).toBeVisible();
    });

    await test.step("And I should be redirected to the new patient's chart page", async () => {
        const patientChartUrlRegex = new RegExp('^[\\w\\d:\\/.-]+\\/patient\\/[\\w\\d-]+\\/chart\\/.*$');
        await page.waitForURL(patientChartUrlRegex);
        await expect(page).toHaveURL(patientChartUrlRegex);

    });

    await test.step("And I should see the newly registered patient's details displayed in the patient banner", async () => {
        const patientBanner = page.locator('header[aria-label="patient banner"]');
        await expect(patientBanner).toBeVisible();
        await expect(patientBanner.getByText('James Deivin')).toBeVisible();
        await expect(patientBanner.getByText(/female/i)).toBeVisible();
        await expect(patientBanner.getByText(/24 yrs/i)).toBeVisible();
        await expect(patientBanner.getByText(/01 — Jan — 2000/i)).toBeVisible();
        await expect(patientBanner.getByText(/OpenMRS ID/i)).toBeVisible();
    });
});
test.afterEach(async ({api}) => {
    await deletePatient(api, patientUuid);
});