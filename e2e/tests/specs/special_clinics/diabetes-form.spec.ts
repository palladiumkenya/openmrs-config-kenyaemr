import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit } from '../../commands';
import { test } from '../../core';
import { SpecialClinicPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;

const genderAgeScenarios = [
    { gender: 'F', age: 25 },
    { gender: 'M', age: 25 }
];

const getPastDateFormatted = (): string => {
    const today = new Date();

    const day = today.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[today.getMonth()];  // Get month name
    const year = today.getFullYear() - 2;

    return `${day} ${month} ${year}`;
};

for (const { gender, age } of genderAgeScenarios) {
    test.describe(`Diabetic Test for Gender=${gender}, Age=${age}`, () => {
        test.beforeEach(async ({ page, api }) => {
            const currentYear = new Date().getFullYear();
            const birthdate = `${currentYear - age}-06-15`;

            patient = await generateRandomPatient(api, gender, birthdate);
            console.log('Patient created:', patient);
            visit = await startVisit(api, patient.uuid);
            console.log('Patient created:', visit);

            const specialClinic = new SpecialClinicPage(page);

            await test.step('When I visit the Neurology page', async () => {
                await specialClinic.gotoDiabetesPage(patient.uuid);
                await expect(specialClinic.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/special-clinics-dashboard?clinic=diabetic-clinic`);
                await expect(page.getByRole('heading', { name: 'Diabetic clinic' })).toBeVisible();
            });

            await test.step('I should be able to click the record diabetic link', async () => {
                await page.getByRole('button', { name: 'Record diabetic clinic' }).click();
                await expect(page.getByText('Diabetic form')).toBeVisible();
            });
        });

        test('I should be able to fill the diabetic form', async ({ page }) => {
            await test.step('I should be able to fill the visit details', async () => {
                await page.getByLabel('New visit').check();
                await page.getByText('NextDiabetes History').click();
            });

            await test.step('I should be able to fill Diabetic history', async () => {
                if (gender === 'M') {
                    await page.getByRole('radio', { name: 'Type 1 Diabetes' }).check();
                } else {
                    await page.getByRole('radio', { name: 'Gestational Diabetes Mellitus' }).check();
                }

                await page.locator('#yearOfDiagnosisid').fill(getPastDateFormatted());

                await page.locator('label').filter({ hasText: 'Dry Skin' }).click();
                await page.locator('label').filter({ hasText: 'Fatigue and weakness' }).click();
                await page.locator('label').filter({ hasText: 'Loss of Sight' }).click();
                await page.locator('label').filter({ hasText: 'Numbness/Tingling in hands or' }).click();
                await page.locator('label').filter({ hasText: 'Polydipsia' }).click();
                await page.locator('label').filter({ hasText: 'Polyphagia' }).click();
                await page.locator('label').filter({ hasText: 'Polyuria' }).click();
                await page.locator('label').filter({ hasText: 'Sexual Dysfunction' }).click();
                await page.locator('label').filter({ hasText: 'Sleep Apnea/Snoring' }).click();
                await page.locator('label').filter({ hasText: 'Slow Healing Wounds' }).click();
                await page.locator('label').filter({ hasText: 'Blurred vision' }).click();
                await page.locator('label').filter({ hasText: 'Others' }).first().click();

                if (gender === 'M') {
                    await page.locator('label').filter({ hasText: 'Heart Problems' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Hyperlipidaemia' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Hypertension' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Nephropathy' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Reflux/Digestion Problems' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Thyroid Problems' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Urinary Tract Infections' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Polycystic Ovary Syndrome (' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Obesity' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Retinopathy' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Stroke' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Coronary Artery Disease (CAD)' }).nth(1).click();
                    await page.locator('label').filter({ hasText: 'Others' }).nth(2).click();
                } else {
                    await page.locator('label').filter({ hasText: 'Heart Problems' }).first().click();
                    await page.locator('label').filter({ hasText: 'Hyperlipidaemia' }).first().click();
                    await page.locator('label').filter({ hasText: 'Hypertension' }).first().click();
                    await page.locator('label').filter({ hasText: 'Nephropathy' }).first().click();
                    await page.locator('label').filter({ hasText: 'Previous Gestional Diabetes' }).click();
                    await page.locator('label').filter({ hasText: 'Reflux/Digestion Problems' }).first().click();
                    await page.locator('label').filter({ hasText: 'Thyroid Problems' }).first().click();
                    await page.locator('label').filter({ hasText: 'Urinary Tract Infections' }).first().click();
                    await page.locator('label').filter({ hasText: 'Polycystic Ovary Syndrome (' }).first().click();
                    await page.locator('label').filter({ hasText: 'Obesity' }).first().click();
                    await page.locator('label').filter({ hasText: 'Retinopathy' }).first().click();
                    await page.locator('label').filter({ hasText: 'Stroke' }).first().click();
                    await page.locator('label').filter({ hasText: 'Coronary Artery Disease (CAD)' }).first().click();
                    await page.locator('label').filter({ hasText: 'Others' }).nth(1).click();
                }

                await page.locator('#recentHospitalAdmissionid_0').check();

                if (gender === 'F') {
                    await page.locator('#pregnantid_1').check();
                    await page.locator('#planningToGetPregnantid_0').check();
                    await page.locator('#contraceptiveUseid_1').check();
                }

                await page.getByLabel('Diabetes Type 2').check();
                await page.getByLabel('Injections').check();
                await page.getByLabel('At Bedtime').check();
                await page.locator('#InsulinDoYouTakeid').fill('1');
                await page.locator('#sideEffectsFromMedicationsid').fill(faker.word.words(5));
                await page.locator('#monitorBloodSugarid_0').check();
                await page.locator('#currentFastingid').fill('4');
                await page.locator('#currentBloodSugar2Hoursid').fill('9');
                await page.getByLabel('Infrequently').check();
                await page.locator('#abilityToAffordTreatmentid_0').check();
            });

            await test.step('I should be able to fill physical activity section ', async () => {
                await page.locator('#exerciseRegularlyid_0').check();
                await page.locator('#durationid').fill('2');
                await page.locator('#frequencyid').fill('1');
                await page.getByLabel('Light').check();
                await page.locator('#dietRestrictionid_0').check();
                await page.locator('#specifyDietRestrictionid').fill(faker.word.words(5));
            });

            await test.step('I should be able to fill the social history section', async () => {
                await page.locator('#tobaccoUseid_0').check();
                await page.locator('#howLongid').fill('3');
                await page.locator('#howManyPacksPerDayid').fill('1');
                await page.locator('#alcoholIntakeid_1').check();
                await page.locator('#substanceDrugUseid_1').check();
                await page.getByLabel('Foot ulcer').check();
                await page.getByText('NextPatient\'s Management').click();
            });

            await test.step('I should be able to fill patient management', async () => {
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.getByRole('textbox').click();
                await page.getByRole('textbox').fill('diabetes mellitus');
                await page.getByText('diabetes mellitus').first().click();
                await page.locator('label').filter({ hasText: 'Disease Process & Treatment' }).click();
                await page.locator('label').filter({ hasText: 'Nutritional Management' }).click();
                await page.locator('label').filter({ hasText: 'Physical Activity' }).click();
                await page.locator('label').filter({ hasText: 'Medication Use' }).click();
                await page.locator('label').filter({ hasText: 'Monitoring Blood Glucose' }).click();
                await page.locator('label').filter({ hasText: 'Complications' }).click();
                await page.locator('label').filter({ hasText: 'Healthy Coping' }).click();
                await page.locator('label').filter({ hasText: 'Others' }).click();
                await page.locator('label').filter({ hasText: 'Lifestyle modification' }).click();
                await page.locator('label').filter({ hasText: 'Diet and exercise' }).click();
                await page.locator('label').filter({ hasText: 'Oral Agents' }).click();
                await page.locator('label').filter({ hasText: 'Non-Insulin Injectables' }).click();
                await page.locator('label').filter({ hasText: /^Insulin$/ }).click();
            });

            await test.step('I should be able to fill the procedures done', async () => {
                await page.locator('label').filter({ hasText: 'Aural toilet(Microsuction)' }).click();
                await page.locator('label').filter({ hasText: 'Hearing Aid' }).click();
                await page.locator('label').filter({ hasText: 'Myringotomy and ventilation' }).click();
                await page.locator('label').filter({ hasText: 'Adenoidectomy' }).click();
                await page.locator('label').filter({ hasText: 'Tympanoplasty' }).click();
                await page.locator('label').filter({ hasText: 'Ossiculoplasty' }).click();
                await page.locator('label').filter({ hasText: 'Endoscopic Sphenopalatine' }).click();
                await page.locator('label').filter({ hasText: 'Septoplasty' }).click();
                await page.locator('label').filter({ hasText: 'Functional Endoscopic Sinus' }).click();
                await page.locator('label').filter({ hasText: 'Tinnitus Retraining Therapy(' }).click();
                await page.locator('label').filter({ hasText: /^Other$/ }).click();
                await page.getByLabel('Released Home').check();
            });

            await test.step('When I click the save and close button the form should save', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                await page.waitForTimeout(500);
                await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
            });
        });
    });
}