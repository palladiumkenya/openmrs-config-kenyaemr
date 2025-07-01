import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit } from '../../commands';
import { test } from '../../core';
import { CarePanelPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;

// Define gender and age combinations
const genderAgeScenarios = [
    { gender: 'F', age: 25 }
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

const clinicalNotes = faker.word.words(3);

for (const { gender, age } of genderAgeScenarios) {
    test.describe(`NCD Test for Gender=${gender}, Age=${age}`, () => {
        test.beforeEach(async ({ page, api }) => {
            const currentYear = new Date().getFullYear();
            const birthdate = `${currentYear - age}-06-15`;

            patient = await generateRandomPatient(api, gender, birthdate);
            console.log('Patient created:', patient);
            visit = await startVisit(api, patient.uuid);

            const carePanelPage = new CarePanelPage(page);

            await test.step('When I visit care panel page', async () => {
                await carePanelPage.gotoCarePanel(patient.uuid);
                await expect(carePanelPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Care panel`);
                await expect(page.getByRole('tab', { name: 'Program enrollment' })).toBeVisible();
            });

            await test.step('I should be able to see the NCD program', async () => {
                await page.getByRole('tab', { name: 'Program enrollment' }).click();
                await page.getByRole('row', { name: 'NCD Eligible Enroll' }).getByRole('button').click();
                await expect(page.getByText('NCD Enrollment form')).toBeVisible();
            });
        });

        test('NCD Diabetic Test', async ({ page }) => {
            await test.step('I should be able to fill the visit details', async () => {
                await page.getByLabel('Referrals').check();
                await page.getByLabel('Internal(Department)').check();
                await page.getByLabel('Diabetic Clinic').check();
                await page.getByText('NextPatient History').click();
            });

            await test.step('I should be able to record patient history', async () => {
                await page.locator('#havingComplaintsid_1').check();
                await page.locator('#clinicNotesid').fill(clinicalNotes);
            });

            await test.step('I should be able to fill diabetes information', async () => {
                await page.getByLabel('Diabetes', { exact: true }).check();
                await page.getByLabel('Known DM patient').check();
                await page.getByLabel('Type 2 Diabetes Mellitus').check();
                await page.locator('#diagnosisDateid').fill(getPastDateFormatted());
                await page.getByLabel('HIV Negative').check();
                await page.getByLabel('No TB Signs').check();
            });

            await test.step('I should be able to fill current lifestyle', async () => {
                await page.locator('#Smokingid_0').check();
                await page.locator('#drinkAlcoholid_0').check();
                await page.locator('#cessationCounsellingid_0').check();
                await page.locator('#physicalActid_0').check();
                await page.locator('#dietConsid_0').check();
                await page.getByText('NextPatient\'s Examination').click();
            });

            await test.step('I should be able to fill the Patient Examination', async () => {
                await page.locator('label').filter({ hasText: 'None' }).click();
                await expect(page.locator('label').filter({ hasText: 'Cyanosis' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Dehydration' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Finger Clubbing' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Jaundice' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Lethargic' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Lymph Node Axillary' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Lymph Nodes Inguinal' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Nasal Flaring' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Oedema' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Oral thrush' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Pallor' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Convulsions' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Wasting' })).toBeDisabled();

                await page.locator('#cardioVascularid_0').check();
                await page.locator('#resPiratoryid_0').check();
                await page.locator('#abdominalPelvicid_0').check();
                await page.locator('#neurologicalExamid_0').check();
                await page.locator('#examOralid_0').check();

                await page.getByLabel('Low Risk').check();
                await expect(page.getByText('* Low Risk assessment')).toBeVisible();
                await page.locator('label').filter({ hasText: 'Intact protective sensation' }).click();
                await page.locator('label').filter({ hasText: 'Pedal Pulses Present' }).click();
                await page.locator('label').filter({ hasText: 'No deformity' }).click();
                await page.locator('label').filter({ hasText: 'No prior foot ulcer' }).click();
                await page.locator('label').filter({ hasText: 'No amputation' }).click();

                await page.getByLabel('Yes').check();
                await page.locator('#descDiabetcid').fill(clinicalNotes);

                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('input[type="text"]').click();
                await page.locator('input[type="text"]').fill('diabetes');
                await page.getByText('diabetes').first().click();

                await page.locator('#clinicNotesCompsid').fill(clinicalNotes);
                await page.getByText('NextPatient\'s Management').click();
            });

            await test.step('I should be able to fill the Patient management', async () => {
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('#DiagNosISid div').nth(1).click();
                await page.locator('#DiagNosISid').getByRole('textbox').fill('diabetes');
                await page.getByText('diabetes').first().click();

                await page.locator('label').filter({ hasText: 'Diet & physical activity' }).click();
                await page.locator('label').filter({ hasText: 'Oral glucose-lowering agents' }).click();
                await page.locator('label').filter({ hasText: 'Insulin and OGLAs' }).click();
                await page.locator('label').filter({ hasText: /^Insulin$/ }).click();
                await page.locator('label').filter({ hasText: 'Anti hypertensives' }).click();
                await page.locator('label').filter({ hasText: /^Herbal$/ }).click();
                await page.locator('label').filter({ hasText: 'Others' }).click();
                await page.locator('label').filter({ hasText: 'Physical Activities' }).click();
                await page.locator('label').filter({ hasText: 'Support Group' }).click();
                await page.locator('label').filter({ hasText: /^Nutrition$/ }).click();
                await page.locator('label').filter({ hasText: 'Mental wellbeing' }).click();
                await page.locator('label').filter({ hasText: /^Alcohol$/ }).click();
                await page.locator('label').filter({ hasText: 'Alcohol Cessation' }).click();
                await page.locator('label').filter({ hasText: 'Tobacco Cessation' }).click();
                await page.locator('label').filter({ hasText: 'Other substances' }).click();
                await page.locator('label').filter({ hasText: 'Herbal use or alternative' }).click();
                await page.locator('#nutAssesmentid').fill(clinicalNotes);

                await page.getByLabel('Referred').check();
                await page.locator('select').selectOption('138202AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
            });

            await test.step('When I click the save and close button the form should save', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                await page.waitForTimeout(500);
                await expect(page.getByText(/Patient has been enrolled successfully/i)).toBeVisible();
            });
        });

        test('NCD Hypertension Test', async ({ page }) => {
            await test.step('I should be able to fill the visit details', async () => {
                await page.getByLabel('Return visit').check();
                await page.getByText('NextPatient History').click();
            });

            await test.step('I should be able to record patient history', async () => {
                await page.locator('#havingComplaintsid_0').check();
                await page.locator('label').filter({ hasText: 'Blurring of vision' }).click();
                await page.locator('label').filter({ hasText: 'Loss of consciousness' }).click();
                await page.locator('label').filter({ hasText: 'Recurrent dizziness' }).click();
                await page.locator('label').filter({ hasText: 'Foot complaints' }).click();
                await page.locator('label').filter({ hasText: 'Shortness of breath on' }).click();
                await page.locator('label').filter({ hasText: 'Palpitations (Heart racing)' }).click();
                await page.locator('label').filter({ hasText: 'Focal weakness' }).click();
                await page.locator('label').filter({ hasText: 'Fainting' }).click();
                await page.locator('label').filter({ hasText: /^Other$/ }).first().click();
                await page.locator('#clinicNotesid').fill(clinicalNotes);
            });

            await test.step('I should be able to fill hypertension information', async () => {
                await page.getByLabel('Hypertension').check();
                await page.getByLabel('Known HTN patient').check();
                await page.locator('#htnStageid').fill(clinicalNotes);
                await page.locator('#dxYearhtnid').fill(getPastDateFormatted());
                await page.getByLabel('HIV Positive').check();
                await page.locator('#haartStatsid_0').check();
                await page.getByLabel('No TB Signs').check();
            });

            await test.step('I should be able to fill current lifestyle', async () => {
                await page.locator('#Smokingid_2').check();
                await page.locator('#stoppedSmokingid').fill(getPastDateFormatted());
                await page.locator('#drinkAlcoholid_2').check();
                await page.locator('#stoppedDrinkingid').fill(getPastDateFormatted());
                await page.locator('#physicalActid_0').check();
                await page.locator('#dietConsid_0').check();
            });

            await test.step('I should be able to fill complications', async () => {
                await page.locator('label').filter({ hasText: 'Stroke' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Retinopathy' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Heart failure' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Diabetic Foot' }).nth(2).click();
                await page.locator('label').filter({ hasText: 'Diabetic Foot Ulcer' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Kidney Failure(CKD)' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Erectile dysfunction' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Peripheral Neuropathy' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Nephropathy' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Ischaemic Heart Disease' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Peripheral Vascular Disease' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Gastropathy' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Cataracts' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Cardiovascular Disease (CVD)' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Dental complications' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Dyslipidemia' }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Obesity' }).nth(1).click();
                await page.locator('label').filter({ hasText: /^HIV$/ }).nth(1).click();
                await page.locator('label').filter({ hasText: /^TB$/ }).nth(1).click();
                await page.locator('label').filter({ hasText: 'Other' }).nth(4).click();
                await page.getByText('NextPatient\'s Examination').click();
            });

            await test.step('I should be able to fill the Patient Examination', async () => {
                await page.locator('label').filter({ hasText: 'None' }).click();
                await expect(page.locator('label').filter({ hasText: 'Cyanosis' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Dehydration' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Finger Clubbing' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Jaundice' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Lethargic' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Lymph Node Axillary' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Lymph Nodes Inguinal' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Nasal Flaring' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Oedema' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Oral thrush' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Pallor' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Convulsions' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Wasting' })).toBeDisabled();

                await page.locator('#cardioVascularid_1').check();
                await page.locator('#CadioDescid').fill(clinicalNotes);
                await page.locator('#resPiratoryid_1').check();
                await page.locator('#resPiratoryDescid').fill(clinicalNotes);
                await page.locator('#abdominalPelvicid_1').check();
                await page.locator('#pelvicDescriptionid').fill(clinicalNotes);
                await page.locator('#neurologicalExamid_1').check();
                await page.locator('#neurologicalDescid').fill(clinicalNotes);
                await page.locator('#examOralid_1').check();
                await page.locator('#oRalDescpid').fill(clinicalNotes);

                await page.getByLabel('Low Risk').check();
                await expect(page.getByText('* Low Risk assessment')).toBeVisible();
                await page.locator('label').filter({ hasText: 'Intact protective sensation' }).click();
                await page.locator('label').filter({ hasText: 'Pedal Pulses Present' }).click();
                await page.locator('label').filter({ hasText: 'No deformity' }).click();
                await page.locator('label').filter({ hasText: 'No prior foot ulcer' }).click();
                await page.locator('label').filter({ hasText: 'No amputation' }).click();

                await page.getByLabel('Yes').check();
                await page.locator('#descDiabetcid').fill(clinicalNotes);

                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('input[type="text"]').click();
                await page.locator('input[type="text"]').fill('diabetes');
                await page.getByText('diabetes').first().click();

                await page.locator('#clinicNotesCompsid').fill(clinicalNotes);
                await page.getByText('NextPatient\'s Management').click();
            });

            await test.step('I should be able to fill the Patient management', async () => {
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('#DiagNosISid div').nth(1).click();
                await page.locator('#DiagNosISid').getByRole('textbox').fill('diabetes');
                await page.getByText('diabetes').first().click();

                await page.locator('label').filter({ hasText: 'Diet & physical activity' }).click();
                await page.locator('label').filter({ hasText: 'Oral glucose-lowering agents' }).click();
                await page.locator('label').filter({ hasText: 'Insulin and OGLAs' }).click();
                await page.locator('label').filter({ hasText: /^Insulin$/ }).click();
                await page.locator('label').filter({ hasText: 'Anti hypertensives' }).click();
                await page.locator('label').filter({ hasText: /^Herbal$/ }).click();
                await page.locator('label').filter({ hasText: 'Others' }).click();
                await page.locator('label').filter({ hasText: 'Physical Activities' }).click();
                await page.locator('label').filter({ hasText: 'Support Group' }).click();
                await page.locator('label').filter({ hasText: /^Nutrition$/ }).click();
                await page.locator('label').filter({ hasText: 'Mental wellbeing' }).click();
                await page.locator('label').filter({ hasText: /^Alcohol$/ }).click();
                await page.locator('label').filter({ hasText: 'Alcohol Cessation' }).click();
                await page.locator('label').filter({ hasText: 'Tobacco Cessation' }).click();
                await page.locator('label').filter({ hasText: 'Other substances' }).click();
                await page.locator('label').filter({ hasText: 'Herbal use or alternative' }).click();
                await page.locator('#nutAssesmentid').fill(clinicalNotes);

                await page.getByLabel('Amputation').check();
            });

            await test.step('When I click the save and close button the form should save', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                await page.waitForTimeout(500);
                await expect(page.getByText(/Patient has been enrolled successfully/i)).toBeVisible();
            });
        });

        test('NCD Co-morbid test', async ({ page }) => {
            await test.step('I should be able to fill the visit details', async () => {
                await page.getByLabel('New visit').check();
                await page.getByText('NextPatient History').click();
            });

            await test.step('I should be able to record patient history', async () => {
                await page.locator('#havingComplaintsid_1').check();
                await page.locator('#clinicNotesid').fill(clinicalNotes);
            });

            await test.step('I should be able to fill co-morbid information', async () => {
                await page.getByLabel('Co-morbid', { exact: true }).check();
                await page.getByText('Known Co-morbid patient').click();
                await page.locator('#dxYearcoid').fill(getPastDateFormatted());
                await page.locator('#typeHypcoid').fill(clinicalNotes);
                await page.locator('#typeDiabtscoid').fill(clinicalNotes);
                await page.getByLabel('HIV Negative').check();
                await page.getByLabel('No TB Signs').check();
            });

            await test.step('I should be able to fill current lifestyle', async () => {
                await page.locator('#Smokingid_1').check();
                await page.locator('#drinkAlcoholid_1').check();
                await page.locator('#physicalActid_0').check();
                await page.locator('#dietConsid_0').check();
            });

            await test.step('I should be able to fill complications', async () => {
                await page.locator('label').filter({ hasText: 'Stroke' }).first().click();
                await page.locator('label').filter({ hasText: 'Retinopathy' }).first().click();
                await page.locator('label').filter({ hasText: 'Heart failure' }).first().click();
                await page.locator('label').filter({ hasText: 'Diabetic Foot' }).first().click();
                await page.locator('label').filter({ hasText: 'Diabetic Foot Ulcer' }).first().click();
                await page.locator('label').filter({ hasText: 'Kidney Failure(CKD)' }).first().click();
                await page.locator('label').filter({ hasText: 'Erectile dysfunction' }).first().click();
                await page.locator('label').filter({ hasText: 'Peripheral Neuropathy' }).first().click();
                await page.locator('label').filter({ hasText: 'Nephropathy' }).first().click();
                await page.locator('label').filter({ hasText: 'Ischaemic Heart Disease' }).first().click();
                await page.locator('label').filter({ hasText: 'Peripheral Vascular Disease' }).first().click();
                await page.locator('label').filter({ hasText: 'Gastropathy' }).first().click();
                await page.locator('label').filter({ hasText: 'Cataracts' }).first().click();
                await page.locator('label').filter({ hasText: 'Cardiovascular Disease (CVD)' }).first().click();
                await page.locator('label').filter({ hasText: 'Dental complications' }).first().click();
                await page.locator('label').filter({ hasText: 'Dyslipidemia' }).first().click();
                await page.locator('label').filter({ hasText: 'Obesity' }).first().click();
                await page.locator('label').filter({ hasText: /^HIV$/ }).first().click();
                await page.locator('label').filter({ hasText: /^TB$/ }).first().click();
                await page.locator('label').filter({ hasText: 'Other' }).nth(3).click();
                await page.getByText('NextPatient\'s Examination').click();
            });

            await test.step('I should be able to fill the Patient Examination', async () => {
                await page.locator('label').filter({ hasText: 'Cyanosis' }).click();
                await page.locator('label').filter({ hasText: 'Dehydration' }).click();
                await page.locator('label').filter({ hasText: 'Finger Clubbing' }).click();
                await page.locator('label').filter({ hasText: 'Jaundice' }).click();
                await page.locator('label').filter({ hasText: 'Lethargic' }).click();
                await page.locator('label').filter({ hasText: 'Lymph Node Axillary' }).click();
                await page.locator('label').filter({ hasText: 'Lymph Nodes Inguinal' }).click();
                await page.locator('label').filter({ hasText: 'Nasal Flaring' }).click();
                await page.locator('label').filter({ hasText: 'Oedema' }).click();
                await page.locator('label').filter({ hasText: 'Oral thrush' }).click();
                await page.locator('label').filter({ hasText: 'Pallor' }).click();
                await page.locator('label').filter({ hasText: 'Convulsions' }).click();
                await page.locator('label').filter({ hasText: 'Wasting' }).click();

                await page.locator('#cardioVascularid_0').check();
                await page.locator('#resPiratoryid_0').check();
                await page.locator('#abdominalPelvicid_0').check();
                await page.locator('#neurologicalExamid_0').check();
                await page.locator('#examOralid_0').check();

                await page.getByLabel('High Risk').check();
                await expect(page.getByText('* High Risk assessment')).toBeVisible();
                await page.locator('label').filter({ hasText: 'Loss of protective sensation' }).click();
                await page.locator('label').filter({ hasText: 'Absent pedal pulses' }).click();
                await page.locator('label').filter({ hasText: 'Foot deformity' }).click();
                await page.locator('label').filter({ hasText: 'History of foot ulcer' }).click();
                await page.locator('label').filter({ hasText: 'Prior amputation' }).click();

                await page.getByLabel('No', { exact: true }).check();

                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('input[type="text"]').click();
                await page.locator('input[type="text"]').fill('diabetes');
                await page.getByText('diabetes').first().click();

                await page.locator('#clinicNotesCompsid').fill(clinicalNotes);
                await page.getByText('NextPatient\'s Management').click();
            });

            await test.step('I should be able to fill the Patient management', async () => {
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('#DiagNosISid div').nth(1).click();
                await page.locator('#DiagNosISid').getByRole('textbox').fill('diabetes');
                await page.getByText('diabetes').first().click();

                await page.locator('label').filter({ hasText: 'Diet & physical activity' }).click();
                await page.locator('label').filter({ hasText: 'Oral glucose-lowering agents' }).click();
                await page.locator('label').filter({ hasText: 'Insulin and OGLAs' }).click();
                await page.locator('label').filter({ hasText: /^Insulin$/ }).click();
                await page.locator('label').filter({ hasText: 'Anti hypertensives' }).click();
                await page.locator('label').filter({ hasText: /^Herbal$/ }).click();
                await page.locator('label').filter({ hasText: 'Others' }).click();
                await page.locator('label').filter({ hasText: 'Physical Activities' }).click();
                await page.locator('label').filter({ hasText: 'Support Group' }).click();
                await page.locator('label').filter({ hasText: /^Nutrition$/ }).click();
                await page.locator('label').filter({ hasText: 'Mental wellbeing' }).click();
                await page.locator('label').filter({ hasText: /^Alcohol$/ }).click();
                await page.locator('label').filter({ hasText: 'Alcohol Cessation' }).click();
                await page.locator('label').filter({ hasText: 'Tobacco Cessation' }).click();
                await page.locator('label').filter({ hasText: 'Other substances' }).click();
                await page.locator('label').filter({ hasText: 'Herbal use or alternative' }).click();
                await page.locator('#nutAssesmentid').fill(clinicalNotes);
            });

            await test.step('When I click the save and close button the form should save', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                await page.waitForTimeout(500);
                await expect(page.getByText(/Patient has been enrolled successfully/i)).toBeVisible();
            });
        });
    });
}