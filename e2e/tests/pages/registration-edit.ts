import {type Locator, type Page, expect} from '@playwright/test';

export type PatientRegistrationSex = 'male' | 'female' | 'other' | 'unknown';
export type MaritalStatus =
    "Married polygamous"
    | "Married monogamous"
    | "Divorced"
    | "Widowed"
    | "Cohabiting"
    | "Single"
export type Occupation = "Farmer" | "Employee" | "Trader" | "Student" | "Driver" | "None" | "Other"
export type Education =
    "None"
    | "Primary School education"
    | "Secondary school education"
    | "College, university or polytechnic"

export interface PatientRegistrationFormValues {
    givenName?: string;
    middleName?: string;
    familyName?: string;
    sex?: PatientRegistrationSex;
    birthdate?: {
        day: string;
        month: string;
        year: string;
    };
    county?: string,
    subCounty?: string,
    ward?: string,
    nationalID?: string,
    phone?: string,
    postal_address?: string,
    email?: string,
    location?: string,
    sublocation?: string,
    village?: string,
    landMark?: string,
    healthCentre?: string,
    maritalStatus?: string,
    occupation?: string,
    education?: string,
    nextOfkinName?: string,
    nextOfKinRelationship?: string,
    nextOfKinNumber?: string,
    nextOfkinPostalAddres?: string,
}

export class RegistrationAndEditPage {
    constructor(readonly page: Page) {
    }

    async gotoRegistration() {
        await this.page.goto('/patient-registration');
    }

    readonly givenNameInput = () => this.page.locator('#givenName');
    readonly middleNameInput = () => this.page.locator('#middleName');
    readonly familyNameInput = () => this.page.locator('#familyName');
    readonly sexRadioButton = (sex: PatientRegistrationSex) => this.page.locator(`label[for=gender-option-${sex}]`);
    readonly birthDateInput = () => this.page.locator('#birthdate');
    readonly birthdateDayInput = () => this.birthDateInput().locator('[data-type="day"]');
    readonly birthdateMonthInput = () => this.birthDateInput().locator('[data-type="month"]');
    readonly birthdateYearInput = () => this.birthDateInput().locator('[data-type="year"]');
    readonly countyInput = () => this.page.locator('#countyDistrict');
    readonly stateCountyInput = () => this.page.locator('#stateProvince');
    readonly cityVillageInput = () => this.page.locator('#cityVillage');
    readonly wardInput = () => this.page.locator("#address4");
    readonly phoneInput = () => this.page.locator('#phone');
    readonly emailInput = () => this.page.locator('#email');
    readonly locationInput = () => this.page.getByLabel('Location (optional)', {exact: true});
    readonly subLocationInput = () => this.page.getByLabel('Sub-location (optional)', {exact: true});
    readonly postalAddressInput = () => this.page.getByLabel('Contact Details Section').getByLabel('Postal Address (optional)');
    readonly villageInput = () => this.page.getByLabel('Village (optional)');
    readonly landmarkInput = () => this.page.getByLabel('Landmark (optional)', {exact: true});
    readonly nearestHealthCentre = () => this.page.getByLabel('Nearest Health Center  (optional)');
    readonly maritalStatus = (status: string | undefined) => this.page.getByLabel('Marital status').selectOption('5555AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    readonly occupationalInput = (occupation: string | undefined) => this.page.getByLabel('Occupation').selectOption('1540AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    readonly educationInput = (education: string | undefined) => this.page.getByLabel('Education').selectOption('1713AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    readonly postToRegistryButton = () => this.page.getByRole('button', {name: 'Post to registry'});
    readonly createPatientButton = () => this.page.getByRole('button', {name: 'Register patient', exact: true});

    async goto(editPatientUuid?: string) {
        await this.page.goto(editPatientUuid ? `patient/${editPatientUuid}/edit` : 'patient-registration');
    }

    // clickin the post-to registry as one confirms the submit button is also disabled
    async waitUntilTheFormIsLoaded() {
        await expect(this.createPatientButton()).toBeDisabled();
        // await this.postToRegistryButton().click();
        // await expect(this.createPatientButton()).toBeVisible();
    }

    async fillPatientRegistrationForm(formValues: PatientRegistrationFormValues, page: Page) {
        // const tryFill = (locator: Locator, value?: string) => value && locator.fill(value);
        const tryFill = async (locator: Locator, value?: string) => {
            if (value) {
                const maxRetries = 3; // Maximum number of retries
                let retries = 0;
                while (retries < maxRetries) {
                    await locator.fill(value); // Attempt to fill the input
                    const currentValue = await locator.inputValue(); // Get the current value of the input
                    if (currentValue === value) {
                        break; // Exit the loop if the value is correctly filled
                    }
                    retries++;
                    console.log(`Retrying to fill input. Attempt ${retries}`);
                    await page.waitForTimeout(500); // Wait before retrying
                }
                if (retries === maxRetries) {
                    throw new Error(`Failed to fill input after ${maxRetries} attempts`);
                }
            }
        };
        // await tryFill(this.givenNameInput(), 'James');
        // await tryFill(this.middleNameInput(), 'Doe');
        // await tryFill(this.familyNameInput(), 'Test');
        // formValues.sex && (await this.sexRadioButton(formValues.sex).check());
        // this.birthDateInput().getByRole('presentation').focus();
        // await tryFill(this.birthdateDayInput(), formValues.birthdate.day);
        // await tryFill(this.birthdateMonthInput(), formValues.birthdate.month);
        // await tryFill(this.birthdateYearInput(), formValues.birthdate.year);
        // await tryFill(this.countyInput(), formValues.county);
        // await tryFill(this.stateCountyInput(), formValues.subCounty);
        // await tryFill(this.wardInput(), formValues.ward);
        // await tryFill(this.phoneInput(), formValues.phone);
        // await tryFill(this.emailInput(), formValues.email);
        // await tryFill(this.locationInput(), formValues.location);
        // await tryFill(this.subLocationInput(), formValues.sublocation);
        // await tryFill(this.postalAddressInput(), formValues.postal_address);
        // await tryFill(this.villageInput(), formValues.village);
        // await tryFill(this.landmarkInput(), formValues.landMark);
        // await tryFill(this.nearestHealthCentre(), formValues.healthCentre);
        // await this.educationInput(formValues.education);
        // await this.occupationalInput(formValues.occupation);
        // await this.maritalStatus(formValues.maritalStatus)
        // await this.postToRegistryButton().click();
        // await this.createPatientButton().click();

        // Retry logic applied only for givenName and familyName
        await tryFill(this.givenNameInput(), 'James');
        await tryFill(this.middleNameInput(), 'Doe');
        await tryFill(this.familyNameInput(), 'Test');

        formValues.sex && (await this.sexRadioButton(formValues.sex).check());
        this.birthDateInput().getByRole('presentation').focus();
        await this.birthdateDayInput().fill(formValues.birthdate.day);
        await this.birthdateMonthInput().fill(formValues.birthdate.month);
        await this.birthdateYearInput().fill(formValues.birthdate.year);
        await this.countyInput().fill(formValues.county);
        await this.stateCountyInput().fill(formValues.subCounty);
        await this.wardInput().fill(formValues.ward);
        await this.phoneInput().fill(formValues.phone);
        await this.emailInput().fill(formValues.email);
        await this.locationInput().fill(formValues.location);
        await this.subLocationInput().fill(formValues.sublocation);
        await this.postalAddressInput().fill(formValues.postal_address);
        await this.villageInput().fill(formValues.village);
        await this.landmarkInput().fill(formValues.landMark);
        await this.nearestHealthCentre().fill(formValues.healthCentre);
        await this.educationInput(formValues.education);
        await this.occupationalInput(formValues.occupation);
        await this.maritalStatus(formValues.maritalStatus);
        await this.postToRegistryButton().click();
        await this.createPatientButton().click();

    }
}