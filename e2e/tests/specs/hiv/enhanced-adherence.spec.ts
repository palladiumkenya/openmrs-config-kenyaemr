import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit, generateHivEnrollmentEncounter } from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;
let hivEnrollment: any;

const getFutureDateFormatted = (): string => {
    const today = new Date();

    const day = today.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[today.getMonth()];  // Get month name
    const year = today.getFullYear() + 1;

    return `${day} ${month} ${year}`;
};

const getCurrentDateFormatted = (): string => {
    const today = new Date();

    const day = today.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[today.getMonth()];  // Get month name
    const year = today.getFullYear();

    return `${day} ${month} ${year}`;
};

const clinicalNotes = faker.word.words(3);

// Define gender and age combinations
const genderAgeScenarios = [
    { gender: 'F', age: 25 }
    // { gender: 'M', age: 25 },
    // { gender: 'M', age: 4 }
];

for (const { gender, age } of genderAgeScenarios) {
    test.describe(`Enhanced Adherence Test for Gender=${gender}, Age=${age}`, () => {
        test.beforeEach(async ({ api }) => {
            const currentYear = new Date().getFullYear();
            const birthdate = `${currentYear - age}-06-15`;

            patient = await generateRandomPatient(api, gender, birthdate);
            console.log('Patient created:', patient);
            visit = await startVisit(api, patient.uuid);
            console.log('Visit created:', visit);
            hivEnrollment = await generateHivEnrollmentEncounter(api, patient.uuid, visit.uuid);
            console.log('Patient Enrolled:', hivEnrollment);
        });
        
        test('Enhanced Adherence Test', async ({ page }) => {
            const carePanelPage = new CarePanelPage(page);
            await test.step('When I visit care panel page', async () => {
                await carePanelPage.gotoCarePanel(patient.uuid);
                await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
                await expect(page.getByRole('tab', { name: 'HIV' })).toBeVisible();
            });
        
            await test.step('And I click on the clinical forms', async () => {
                const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
                await clinicalFormsButton.click();
                await expect(page.getByText('Enhanced Adherence Screening')).toBeVisible();
            });

            await test.step('I should be able to click on the Enhanced Adherence Screening form', async () => {
                await page.getByText('Enhanced Adherence Screening').click();
                await expect(page.getByText('Save and close Discard')).toBeVisible();
            });

            await test.step('If I try to save without entering anything', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Session Number: This field is required! Fix')).toBeVisible();
                await expect(page.getByText('Date of session: This field is required! Fix')).toBeVisible();
            });

            await test.step('When I try to provide invalid dates, I should see errors', async () => {
                await page.locator('#encDateid').fill('34/34/3034'); //fill invalid date
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
                await page.locator('#encDateid').fill(getFutureDateFormatted());
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Future date is not allowed!$/ }).nth(2)).toBeVisible();
                await page.locator('#encDateid').fill(getCurrentDateFormatted());
                await page.mouse.click(100, 200);
            });

            await test.step('I should be able to fill session details', async () => {
                await page.locator('#sessionNumberid').fill('14');

                await page.locator('#firstSessionid').fill('34/34/3034'); //fill invalid date
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
                await page.locator('#firstSessionid').fill(getFutureDateFormatted());
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Future date is not allowed!$/ })).toBeVisible();
                await page.locator('#firstSessionid').fill(getCurrentDateFormatted());
                await page.mouse.click(100, 200);

                await page.locator('#pillAdherenceid').fill('14');
            });

            await test.step('When I click next, I should be able to see Morisky adherence sections', async () => {
                await page.getByText('NextMorisky adherence').click();
                await expect(page.getByRole('button', { name: 'Morisky Medication Adherence Scale (MMAS - 4)' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'Morisky Medication Adherence Score' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'Viral load' })).toBeVisible();
                await expect(page.getByRole('button', { name: 'Review adherence plan from previous session' })).toBeVisible();
            });

            await test.step('I should be able to fill MMAS', async () => {
                await page.locator('#forgetid_0').click();
                await expect(page.locator('#forgetid_0')).toBeChecked();
                await page.locator('#forgetid_1').click();
                await expect(page.locator('#forgetid_1')).toBeChecked();
                
                await page.locator('#carelessAtTimesid_0').click();
                await expect(page.locator('#carelessAtTimesid_0')).toBeChecked();
                await page.locator('#carelessAtTimesid_1').click();
                await expect(page.locator('#carelessAtTimesid_1')).toBeChecked();

                await page.locator('#feelWorseid_0').click();
                await expect(page.locator('#feelWorseid_0')).toBeChecked();
                await page.locator('#feelWorseid_1').click();
                await expect(page.locator('#feelWorseid_1')).toBeChecked();

                await page.locator('#feelBetterid_0').click();
                await expect(page.locator('#feelBetterid_0')).toBeChecked();
                await page.locator('#feelBetterid_1').click();
                await expect(page.locator('#feelBetterid_1')).toBeChecked();
            });

            await test.step('I should be able to fill the Adherence score', async () => {
                await page.locator('#adherenceid_0').click();
                await expect(page.locator('#adherenceid_0')).toBeChecked();
                await page.locator('#adherenceid_1').click();
                await expect(page.locator('#adherenceid_1')).toBeChecked();
                await page.locator('#adherenceid_2').click();
                await expect(page.locator('#adherenceid_2')).toBeChecked();
            });

            await test.step('I should be able to fill the viral load section', async () => {
                await page.locator('#receivedVlResultid_1').click();
                await expect(page.locator('#receivedVlResultid_1')).toBeChecked();
                await expect(page.locator('#resultStatusid_0')).not.toBeVisible();
                await page.locator('#receivedVlResultid_0').click();
                await expect(page.locator('#receivedVlResultid_0')).toBeChecked();
                await expect(page.locator('#resultStatusid_0')).toBeVisible();

                await page.locator('#resultStatusid_0').click();
                await expect(page.locator('#resultStatusid_0')).toBeChecked();
                await expect(page.locator('#highVlCauseid')).not.toBeVisible();
                await page.locator('#resultStatusid_1').click();
                await expect(page.locator('#resultStatusid_1')).toBeChecked();
                await expect(page.locator('#highVlCauseid')).toBeVisible();

                await page.locator('#patientFeelid').fill(clinicalNotes);
                await page.locator('#highVlCauseid').fill(clinicalNotes);
                await page.locator('#wayForwardid').fill(clinicalNotes);
            });

            await test.step('I should be able to fill the review adherence section', async () => {
                await page.locator('#imrovedAdherenceid_0').click();
                await expect(page.locator('#imrovedAdherenceid_0')).toBeChecked();
                await page.locator('#imrovedAdherenceid_1').click();
                await expect(page.locator('#imrovedAdherenceid_1')).toBeChecked();

                await page.locator('#missedDosesid_0').click();
                await expect(page.locator('#missedDosesid_0')).toBeChecked();
                await page.locator('#missedDosesid_1').click();
                await expect(page.locator('#missedDosesid_1')).toBeChecked();

                await page.locator('#barriersToAdherenceid').fill(clinicalNotes);
            });

            await test.step('When I click next, I should be able to see Barriers to adherence sections', async () => {
                await page.getByText('Next Barriers to adherence').click();
                await expect(page.getByRole('button', { name: ' Assess for possible barriers to adherence - Cognitive  ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Assess for possible barriers to adherence - Behavioural  ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Assess for possible barriers to adherence - Emotional  ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Assess for possible barriers to adherence - Socio-Economic ' })).toBeVisible();
            });

            await test.step('I should be able to fill the cognitive part', async () => {
                await page.locator('#hivKnowledgeid').fill(clinicalNotes);
            });

            await test.step('I should be able to fill the behavioural part', async () => {
                await page.locator('#takeDrugsid').fill(clinicalNotes);
                await page.locator('#dailyRoutinesid').fill(clinicalNotes);
                await page.locator('#visitsTravelsid').fill(clinicalNotes);
                await page.locator('#sideEffectsid').fill(clinicalNotes);
                await page.locator('#difficultSituationsid').fill(clinicalNotes);
            });

            await test.step('I should be able to fill the emotional part', async () => {
                await page.locator('#dailyIntakeid').fill(clinicalNotes);
                await page.locator('#lifeAmbitionsid').fill(clinicalNotes);
            });

            await test.step('I should be able to fill the socio econimic part', async () => {
                await page.locator('#discloseStatusid_0').click();
                await expect(page.locator('#discloseStatusid_0')).toBeChecked();
                await page.locator('#discloseStatusid_1').click();
                await expect(page.locator('#discloseStatusid_1')).toBeChecked();

                await page.locator('#familySupportid').fill(clinicalNotes);
                await page.locator('#familyIncomeid').fill(clinicalNotes);

                await page.locator('#clinicAcessid_0').click();
                await expect(page.locator('#clinicAcessid_0')).toBeChecked();
                await page.locator('#clinicAcessid_1').click();
                await expect(page.locator('#clinicAcessid_1')).toBeChecked();

                await page.locator('#accidentalStatusid_0').click();
                await expect(page.locator('#accidentalStatusid_0')).toBeChecked();
                await page.locator('#accidentalStatusid_1').click();
                await expect(page.locator('#accidentalStatusid_1')).toBeChecked();

                await page.locator('#treatDifferentlyid_0').click();
                await expect(page.locator('#treatDifferentlyid_0')).toBeChecked();
                await page.locator('#treatDifferentlyid_1').click();
                await expect(page.locator('#treatDifferentlyid_1')).toBeChecked();

                await page.locator('#stigmaEffectid_0').click();
                await expect(page.locator('#stigmaEffectid_0')).toBeChecked();
                await page.locator('#stigmaEffectid_1').click();
                await expect(page.locator('#stigmaEffectid_1')).toBeChecked();

                await page.locator('#religiousHealingid_0').click();
                await expect(page.locator('#religiousHealingid_0')).toBeChecked();
                await page.locator('#religiousHealingid_1').click();
                await expect(page.locator('#religiousHealingid_1')).toBeChecked();
            });

            await test.step('When I click next, I should be able to see Referrals and Networks sections', async () => {
                await page.getByText('NextReferrals and Networks').click();
                await expect(page.locator('#tab').getByRole('button', { name: 'Referrals and Networks' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Next appointment date ' })).toBeVisible();
            });

            await test.step('I should be able to fill the referral section', async () => {
                await page.locator('#referServicesid_0').click();
                await expect(page.locator('#referServicesid_0')).toBeChecked();
                await page.locator('#referServicesid_1').click();
                await expect(page.locator('#referServicesid_1')).toBeChecked();

                await page.locator('#attendAppointmentsid_0').click();
                await expect(page.locator('#attendAppointmentsid_0')).toBeChecked();
                await page.locator('#attendAppointmentsid_1').click();
                await expect(page.locator('#attendAppointmentsid_1')).toBeChecked();

                await page.locator('#referalExperienceid').fill(clinicalNotes);

                await page.locator('#homeVisitid_0').click();
                await expect(page.locator('#homeVisitid_0')).toBeChecked();
                await page.locator('#homeVisitid_1').click();
                await expect(page.locator('#homeVisitid_1')).toBeChecked();

                await page.locator('#adherencePlanid').fill(clinicalNotes);
            });

            await test.step('I should be able to see the Next appointment button', async () => {
                await expect(page.locator('#appointmentWorkspaceLauncherid')).toBeVisible();
            });

            await test.step('When I click the save and close button the form should save', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                await await page.waitForTimeout(500);
                await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
            });
        });
    });
}