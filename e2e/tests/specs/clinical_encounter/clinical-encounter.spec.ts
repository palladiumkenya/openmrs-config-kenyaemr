import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit } from '../../commands';
import { test } from '../../core';
import { SummaryPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;

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
    test.describe(`Clinical Encounter Test for Gender=${gender}, Age=${age}`, () => {
        test.beforeEach(async ({ api }) => {
            const currentYear = new Date().getFullYear();
            const birthdate = `${currentYear - age}-06-15`;

            patient = await generateRandomPatient(api, gender, birthdate);
            console.log('Patient created:', patient);
            visit = await startVisit(api, patient.uuid);
        });
        
        test('Clinical Encounter Test', async ({ page }) => {
            const patientSummary = new SummaryPage(page);
            page.on('dialog', dialog => dialog.accept());
        
            await test.step('When I visit the patient summary page', async () => {
                await patientSummary.gotoSummaryPage(patient.uuid);
                await expect(patientSummary.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Patient Summary`);
            });
        
            await test.step('And I click on the clinical forms', async () => {
                const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
                await clinicalFormsButton.click();
                await expect(page.getByText('Clinical Encounter')).toBeVisible();
            });
            
            await test.step('I should be able to click on the clinical encounter form', async () => {
                await page.getByText('Clinical Encounter').click();
                await expect(page.getByText('Save and close Discard')).toBeVisible();
            });
        
            await test.step('If I try to save without entering anything', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                //await expect(page.getByText('Visit Type? This field is required! Fix')).toBeVisible();
                await expect(page.getByText('Patient having complaint(s) today? This field is required! Fix')).toBeVisible();
                await expect(page.getByText('Patient has adverse drug reaction(s)? This field is required! Fix')).toBeVisible();
                await expect(page.getByText('General examination findings: This field is required! Fix')).toBeVisible();
                await expect(page.getByText('Finding(s) on systems review? This field is required! Fix')).toBeVisible();
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
        
            await test.step('I should be able to select visit types', async () => {
                await page.locator('#visitTypeid_0').click();
                await expect(page.locator('#visitTypeid_0')).toBeChecked();
                await page.locator('#visitTypeid_1').click();
                await expect(page.locator('#visitTypeid_1')).toBeChecked();
                await page.locator('#visitTypeid_2').click();
                await expect(page.locator('#visitTypeid_2')).toBeChecked();
                await expect(page.getByText('Visit To:')).toBeVisible();
                await page.locator('#visitToid_0').click();
                await expect(page.locator('#visitToid_0')).toBeChecked();
            });
            
            await test.step('When I select inpatient type of visit, the patient history and examination should be empty', async () => {
                await page.locator('#visitToid_1').click();
                await expect(page.locator('#visitToid_1')).toBeChecked();
                await page.getByText('NextPatient History').click();
                await expect(page.getByRole('button', { name: ' Complaints and History of complaints ' })).toHaveCount(0);
                await expect(page.getByRole('button', { name: ' Past Medical/Surgical History ' })).toHaveCount(0);
                await expect(page.getByRole('button', { name: ' Adverse Drug Reactions ' })).toHaveCount(0);
                await expect(page.getByRole('button', { name: ' Sexual and Reproductive History ' })).toHaveCount(0);
                await expect(page.getByRole('button', { name: ' Family Planning Status ' })).toHaveCount(0);
                await page.getByText('NextPatient Examination').click();
                await expect(page.getByRole('button', { name: ' General Examination Findings ' })).toHaveCount(0);
                await expect(page.getByRole('button', { name: ' System Examination ' })).toHaveCount(0);
                await expect(page.getByRole('button', { name: ' Diagnosis ' })).toHaveCount(0);
                await expect(page.getByRole('button', { name: ' Investigations ' })).toHaveCount(0);
            });
        
            await test.step('When I select other visit types the sections should be visible', async () => {
                await page.getByRole('button', { name: 'Visit Details' }).click();
                await expect(page.getByRole('heading', { name: 'Visit Details' })).toBeVisible();
                await page.locator('#visitTypeid_0').click();
                await expect(page.locator('#visitTypeid_0')).toBeChecked();
                await page.getByText('NextPatient History').click();
                await expect(page.getByRole('button', { name: ' Complaints and History of complaints ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Past Medical/Surgical History ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Adverse Drug Reactions ' })).toBeVisible();
                if(age<=5){
                    await expect(page.getByRole('button', { name: ' Pediatric History ' })).toBeVisible();
                }
                if(gender === 'F' && (age > 9 || age < 50)){
                    await expect(page.getByRole('button', { name: ' Sexual and Reproductive History ' })).toBeVisible();
                }
                if(age>14) {
                    await expect(page.getByRole('button', { name: ' Family Planning Status ' })).toBeVisible();
                }
            });
        
            await test.step('I should be able to fill the presenting complaints section', async () => {
                await page.locator('#complaintsTodayid_0').click();
                await expect(page.locator('#complaintsTodayid_0')).toBeChecked();
                await expect(page.getByRole('heading', { name: 'Presenting complaints' })).toBeVisible();
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('#cOmplaIntFieldid').selectOption('151AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.locator('#complaint-durationid').fill('14');
                await page.locator('#onsetStatusid').selectOption('1499AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.getByRole('button', { name: 'Remove' }).nth(1).click();
                await page.getByRole('button', { name: 'Remove' }).click();
                await page.locator('#complaintsTodayid_1').click();
                await expect(page.locator('#complaintsTodayid_1')).toBeChecked();
                await page.locator('#ClinICNotesid').fill(clinicalNotes);
            });
        
            await test.step('I should be able to fill the past medical/surgical history', async () => {
                await page.locator('#medHisid_0').click();
                await expect(page.locator('#medHisid_0')).toBeChecked();
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('#druGid').fill(clinicalNotes);
                await page.locator('#doseid').fill('1');
                await page.locator('#frequencyid').selectOption('160866AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.locator('#routeOfAdminid').selectOption('160240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.getByRole('button', { name: 'Remove' }).nth(1).click();
                await page.getByRole('button', { name: 'Remove' }).click();
                await page.locator('#medHisid_1').click();
                await expect(page.locator('#medHisid_1')).toBeChecked();
        
                await page.locator('#herbalRemediesid_0').click();
                await expect(page.locator('#herbalRemediesid_0')).toBeChecked();
                await page.locator('#herbalRemediesid_1').click();
                await expect(page.locator('#herbalRemediesid_1')).toBeChecked();
        
                await page.locator('#traumaHistoryid_0').click();
                await expect(page.locator('#traumaHistoryid_0')).toBeChecked();
                await page.locator('#traumaHistoryid_1').click();
                await expect(page.locator('#traumaHistoryid_1')).toBeChecked();
        
                await page.locator('#transfussionHistoryid_0').click();
                await expect(page.locator('#transfussionHistoryid_0')).toBeChecked();
                await page.locator('#transfussionHistoryid_1').click();
                await expect(page.locator('#transfussionHistoryid_1')).toBeChecked();
        
                await page.locator('#primaryDoctorid_0').click();
                await expect(page.locator('#primaryDoctorid_0')).toBeChecked();
                await page.locator('#primaryDoctorid_1').click();
                await expect(page.locator('#primaryDoctorid_1')).toBeChecked();
        
                await page.locator('#surgHisid_0').click();
                await expect(page.locator('#surgHisid_0')).toBeChecked();
                await page.locator('#typeofSurgeryid').fill(clinicalNotes);
                await page.locator('#dateOfSurgeryid').fill('34/34/3034'); //fill invalid date
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
                await page.locator('#dateOfSurgeryid').fill(getFutureDateFormatted());
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Future date is not allowed!$/ }).nth(2)).toBeVisible();
                await page.locator('#dateOfSurgeryid').fill(getCurrentDateFormatted());
                await page.mouse.click(100, 200);
                await page.locator('#surgHisid_1').click();
                await expect(page.locator('#surgHisid_1')).toBeChecked();
        
                await page.locator('#admissionHistoryid_0').click();
                await expect(page.locator('#admissionHistoryid_0')).toBeChecked();
                await page.locator('#admiReasonid').fill(clinicalNotes);
                await page.locator('#dateOfAdmissionid').fill('34/34/3034'); //fill invalid date
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
                await page.locator('#dateOfAdmissionid').fill(getFutureDateFormatted());
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Future date is not allowed!$/ }).nth(2)).toBeVisible();
                await page.locator('#dateOfAdmissionid').fill(getCurrentDateFormatted());
                await page.mouse.click(100, 200);
                await page.locator('#admissionHistoryid_1').click();
                await expect(page.locator('#admissionHistoryid_1')).toBeChecked();
            });
        
            await test.step('I should be able to fill the adverse drug reaction section', async () => {
                await page.locator('#AdverseReactionsid_0').click();
                await expect(page.locator('#AdverseReactionsid_0')).toBeChecked();
                await expect(page.getByRole('heading', { name: ' Patient has adverse drug reaction(s) ' })).toBeVisible();
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('#AdVerseMedid').selectOption('103727AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.locator('#rEActionid').selectOption('879AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.locator('#seVERityid').selectOption('1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.locator('#dateOnsetAdverseid').fill('34/34/3034'); //fill invalid date
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
                await page.locator('#dateOnsetAdverseid').fill(getFutureDateFormatted());
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Future date is not allowed!$/ }).nth(2)).toBeVisible();
                await page.locator('#dateOnsetAdverseid').fill(getCurrentDateFormatted());
                await page.mouse.click(100, 200);
                await page.locator('#ActIonTakenid').selectOption('1260AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.getByRole('button', { name: 'Remove' }).nth(1).click();
                await page.getByRole('button', { name: 'Remove' }).click();
                await page.locator('#AdverseReactionsid_1').click();
                await expect(page.locator('#AdverseReactionsid_1')).toBeChecked();
            });
        
            if(age<=5) {
                await test.step('If the patient is under 5 I should fill the paedriatic section', async () => {
                    await page.locator('#achievingMilestonesid_0').click();
                    await expect(page.locator('#achievingMilestonesid_0')).toBeChecked();
                    await expect(page.getByText('   Milestone Delayed ')).toBeVisible();
                    await page.locator('#milestoneDelayedid').fill(clinicalNotes);
                    await page.locator('#achievingMilestonesid_1').click();
                    await expect(page.locator('#achievingMilestonesid_1')).toBeChecked();
                    await page.locator('#achievingMilestonesid_2').click();
                    await expect(page.locator('#achievingMilestonesid_2')).toBeChecked();
                    await expect(page.getByText('   Milestone Regressed ')).toBeVisible();
                    await page.locator('#milestoneRegressedid').fill(clinicalNotes);
                    await page.locator('#modeFeedingid_0').click();
                    await expect(page.locator('#modeFeedingid_0')).toBeChecked();
                    await page.locator('#modeFeedingid_1').click();
                    await expect(page.locator('#modeFeedingid_1')).toBeChecked();
                    await page.locator('#modeFeedingid_2').click();
                    await expect(page.locator('#modeFeedingid_2')).toBeChecked();
                    await page.locator('#modeFeedingid_3').click();
                    await expect(page.locator('#modeFeedingid_3')).toBeChecked();
                });
            }

            if(gender === 'F' && (age > 9 || age < 50)){
                await test.step('If the patient is female and aged 10 - 49, I should see and fill the sexual reproductive section', async () => {
                    await page.locator('#hasLMPid_0').click();
                    await expect(page.locator('#hasLMPid_0')).toBeChecked();
                    await expect(page.getByText('   Age at Menarche: ')).toBeVisible();
                    await page.locator('#menarcheAgeid').fill('10');
                    await page.locator('#lmPdAteid').fill('34/34/3034'); //fill invalid date
                    await page.mouse.click(100, 200);
                    await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
                    await page.locator('#lmPdAteid').fill(getFutureDateFormatted());
                    await page.mouse.click(100, 200);
                    await expect(page.locator('p').filter({ hasText: 'Future date is not allowed!' })).toBeVisible();
                    await page.locator('#lmPdAteid').fill(getCurrentDateFormatted());
                    await page.mouse.click(100, 200);
                    await page.locator('#mensesFrequencyid_0').click();
                    await expect(page.locator('#mensesFrequencyid_0')).toBeChecked();
                    await page.locator('#mensesFrequencyid_1').click();
                    await expect(page.locator('#mensesFrequencyid_1')).toBeChecked();
                    await page.locator('#mensesCharacteristicid_0').click();
                    await expect(page.locator('#mensesCharacteristicid_0')).toBeChecked();
                    await page.locator('#mensesCharacteristicid_1').click();
                    await expect(page.locator('#mensesCharacteristicid_1')).toBeChecked();
                    await page.locator('#mensesCharacteristicid_2').click();
                    await expect(page.locator('#mensesCharacteristicid_2')).toBeChecked();
                    await page.locator('#mensesdaysid').fill('5');
                    await page.locator('#intraMenstrualHistoryid_0').click();
                    await expect(page.locator('#intraMenstrualHistoryid_0')).toBeChecked();
                    await page.locator('#intraMenstrualHistoryid_1').click();
                    await expect(page.locator('#intraMenstrualHistoryid_1')).toBeChecked();
                    await page.locator('#associatedSymptomsid').fill(clinicalNotes);
                    await page.locator('#hasLMPid_1').click();
                    await expect(page.locator('#hasLMPid_1')).toBeChecked();
                    await expect(page.getByText('   Reasons For Amenorrhea? ')).toBeVisible();
                    await page.locator('#amenorrheaSymptopmsNoid_0').click();
                    await expect(page.locator('#amenorrheaSymptopmsNoid_0')).toBeChecked();
                    await page.locator('#amenorrheaSymptopmsNoid_1').click();
                    await expect(page.locator('#amenorrheaSymptopmsNoid_1')).toBeChecked();
                    await expect(page.getByText('   Other Amenorrhea reason(Specify) ')).toBeVisible();
                    await page.locator('#otherAmenorrheaid').fill(clinicalNotes);
                    await page.locator('#previousSurgeryGynoid_0').click();
                    await expect(page.locator('#previousSurgeryGynoid_0')).toBeChecked();
                    await expect(page.getByText('   Name of the procedure ')).toBeVisible();
                    await page.locator('#nameOfProcedureOrderdid').fill(clinicalNotes);
                    await page.locator('#previousSurgeryGynoid_1').click();
                    await expect(page.locator('#previousSurgeryGynoid_1')).toBeChecked();
                });
            }
        
            if(gender === 'F' && age > 14 ) {
                await test.step('If the patient is female and above 14 I should fill the female family planning section', async () => {
                    await page.locator('#fPlanningid_0').click();
                    await expect(page.locator('#fPlanningid_0')).toBeChecked();
                    await page.locator('#fPlanningid_1').click();
                    await expect(page.locator('#fPlanningid_1')).toBeChecked();
                    await page.locator('#fPlanningid_2').click();
                    await expect(page.locator('#fPlanningid_2')).toBeChecked();

                    //missing family planning methods
                });
            }

            if(gender === 'M' && age > 14 ) {
                await test.step('If the patient is male and above 14 I should fill the male family planning section', async () => {
                    await page.locator('#MalefPlanningid').selectOption('965AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                    await page.locator('label').filter({ hasText: 'Condoms' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Condoms' })).toBeChecked();
                    await page.locator('label').filter({ hasText: 'Condoms' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Condoms' })).not.toBeChecked();
                    await page.locator('label').filter({ hasText: 'Vasectomy' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Vasectomy' })).toBeChecked();
                    await page.locator('label').filter({ hasText: 'Vasectomy' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Vasectomy' })).not.toBeChecked();
                    await page.locator('#MalefPlanningid').selectOption('1360AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                    await page.locator('label').filter({ hasText: 'Condoms' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Condoms' })).toBeChecked();
                    await page.locator('label').filter({ hasText: 'Condoms' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Condoms' })).not.toBeChecked();
                    await page.locator('label').filter({ hasText: 'Vasectomy' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Vasectomy' })).toBeChecked();
                    await page.locator('label').filter({ hasText: 'Vasectomy' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Vasectomy' })).not.toBeChecked();
                    await page.locator('#MalefPlanningid').selectOption('160652AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                    await page.locator('#notOnFpMaleid_0').click();
                    await expect(page.locator('#notOnFpMaleid_0')).toBeChecked();
                    await page.locator('#notOnFpMaleid_1').click();
                    await expect(page.locator('#notOnFpMaleid_1')).toBeChecked();
                    await expect(page.getByText('   Other (Specify) ').nth(1)).toBeVisible();
                });
            }
        
            await test.step('When I click next I should be in the Patient examination section', async () => {
                await page.getByText('NextPatient Examination').click();
                await expect(page.getByRole('button', { name: ' General Examination Findings ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' System Examination ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Diagnosis ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Investigations ' })).toBeVisible();
            });
        
            await test.step('When I check none under general examination, the other options should be disabled', async () => {
                await page.locator('label').filter({ hasText: /^None$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^None$/ })).toBeChecked();
                await expect(page.locator('label').filter({ hasText: /^Abnormal Gait$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Apathy$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Convulsions$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Dehydration$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Finger Clubbing$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Ill-Looking' })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Jaundice$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Lethargic$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Lymphadenopathy$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Nasal Flaring$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Oedema$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Oral thrush$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Pallor$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Palmar Erythema$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Restless$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Wasting$/ })).toBeDisabled();
            });
        
            await test.step('when I uncheck none, the options should enable', async () => {
                await page.locator('label').filter({ hasText: /^None$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^None$/ })).not.toBeChecked();
                await expect(page.locator('label').filter({ hasText: /^Abnormal Gait$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Apathy$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Convulsions$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Dehydration$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Finger Clubbing$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: 'Ill-Looking' })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Jaundice$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Lethargic$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Lymphadenopathy$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Nasal Flaring$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Oedema$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Oral thrush$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Pallor$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Palmar Erythema$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Restless$/ })).toBeEnabled();
                await expect(page.locator('label').filter({ hasText: /^Wasting$/ })).toBeEnabled();
            });
        
            await test.step('I should be able to check and uncheck other examination', async () => {
                //abnormal gait
                await page.locator('label').filter({ hasText: /^Abnormal Gait$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abnormal Gait$/ })).toBeChecked();
                await expect(page.getByText(' *  Finding ').first()).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Finding This field is required! Fix')).toBeVisible();
                await page.locator('#gaitFindingid_0').click();
                await expect(page.locator('#gaitFindingid_0')).toBeChecked();
                await page.locator('#gaitFindingid_1').click();
                await expect(page.locator('#gaitFindingid_1')).toBeChecked();
                await page.locator('#gaitFindingid_2').click();
                await expect(page.locator('#gaitFindingid_2')).toBeChecked();
                await page.locator('#gaitFindingid_3').click();
                await expect(page.locator('#gaitFindingid_3')).toBeChecked();
                await page.locator('#gaitFindingid_4').click();
                await expect(page.locator('#gaitFindingid_4')).toBeChecked();
                await page.locator('#gaitFindingid_5').click();
                await expect(page.locator('#gaitFindingid_5')).toBeChecked();
                await page.locator('#gaitFindingid_6').click();
                await expect(page.locator('#gaitFindingid_6')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Abnormal Gait$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abnormal Gait$/ })).not.toBeChecked();
        
                //apathy
                await page.locator('label').filter({ hasText: /^Apathy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Apathy$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Apathy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Apathy$/ })).not.toBeChecked();
                
                //Cyanosis
                await page.locator('label').filter({ hasText: /^Cyanosis$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).toBeChecked();
                await expect(page.getByText(' *  Types ').first()).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Types This field is required! Fix')).toBeVisible();
                await page.locator('#cyanosisTypeid_0').click();
                await expect(page.locator('#cyanosisTypeid_0')).toBeChecked();
                await page.locator('#cyanosisTypeid_1').click();
                await expect(page.locator('#cyanosisTypeid_1')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Cyanosis$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).not.toBeChecked();
        
                //Convulsions
                await page.locator('label').filter({ hasText: /^Convulsions$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Convulsions$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Convulsions$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Convulsions$/ })).not.toBeChecked();
        
                //Dehydration
                await page.locator('label').filter({ hasText: /^Dehydration$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Dehydration$/ })).toBeChecked();
                await expect(page.getByText('* Types ').nth(1)).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Types This field is required! Fix')).toBeVisible();
                await page.locator('#dehydrationTypeid_0').click();
                await expect(page.locator('#dehydrationTypeid_0')).toBeChecked();
                await page.locator('#dehydrationTypeid_1').click();
                await expect(page.locator('#dehydrationTypeid_1')).toBeChecked();
                await page.locator('#dehydrationTypeid_2').click();
                await expect(page.locator('#dehydrationTypeid_2')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Dehydration$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Dehydration$/ })).not.toBeChecked();
        
                //Finger-clubbing
                await page.locator('label').filter({ hasText: /^Finger Clubbing$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Finger Clubbing$/ })).toBeChecked();
                await expect(page.getByText(' *  Grading ').nth(1)).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Grading This field is required! Fix')).toBeVisible();
                await page.locator('#fingerclubGradingid_0').click();
                await expect(page.locator('#fingerclubGradingid_0')).toBeChecked();
                await page.locator('#fingerclubGradingid_1').click();
                await expect(page.locator('#fingerclubGradingid_1')).toBeChecked();
                await page.locator('#fingerclubGradingid_2').click();
                await expect(page.locator('#fingerclubGradingid_2')).toBeChecked();
                await page.locator('#fingerclubGradingid_3').click();
                await expect(page.locator('#fingerclubGradingid_3')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Finger Clubbing$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Finger Clubbing$/ })).not.toBeChecked();
        
                //Ill-Looking
                await page.locator('label').filter({ hasText: 'Ill-Looking' }).click();
                await expect(page.locator('label').filter({ hasText: 'Ill-Looking' })).toBeChecked();
                await page.locator('label').filter({ hasText: 'Ill-Looking' }).click();
                await expect(page.locator('label').filter({ hasText: 'Ill-Looking' })).not.toBeChecked();
        
                //Jaundice
                await page.locator('label').filter({ hasText: /^Jaundice$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Jaundice$/ })).toBeChecked();
                await expect(page.getByText('* Grading').first()).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Grading This field is required! Fix')).toBeVisible();
                await page.locator('#jaundiceGradingid_0').click();
                await expect(page.locator('#jaundiceGradingid_0')).toBeChecked();
                await page.locator('#jaundiceGradingid_1').click();
                await expect(page.locator('#jaundiceGradingid_1')).toBeChecked();
                await page.locator('#jaundiceGradingid_2').click();
                await expect(page.locator('#jaundiceGradingid_2')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Jaundice$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Jaundice$/ })).not.toBeChecked();
        
                //Lethargic
                await page.locator('label').filter({ hasText: /^Lethargic$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Lethargic$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Lethargic$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Lethargic$/ })).not.toBeChecked();
        
                //Lymphadenopathy
                await page.locator('label').filter({ hasText: /^Lymphadenopathy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Lymphadenopathy$/ })).toBeChecked();
                await expect(page.getByText('* Site').nth(1)).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Site This field is required! Fix')).toBeVisible();
                await page.locator('#siteLymphid_0').click();
                await expect(page.locator('#siteLymphid_0')).toBeChecked();
                await page.locator('#siteLymphid_1').click();
                await expect(page.locator('#siteLymphid_1')).toBeChecked();
                await page.locator('#siteLymphid_2').click();
                await expect(page.locator('#siteLymphid_2')).toBeChecked();
                await page.locator('#siteLymphid_3').click();
                await expect(page.locator('#siteLymphid_3')).toBeChecked();
                await page.locator('#siteLymphid_4').click();
                await expect(page.locator('#siteLymphid_4')).toBeChecked();
                await page.locator('#siteLymphid_5').click();
                await expect(page.locator('#siteLymphid_5')).toBeChecked();
                await page.locator('#siteLymphid_6').click();
                await expect(page.locator('#siteLymphid_6')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Lymphadenopathy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Lymphadenopathy$/ })).not.toBeChecked();
        
                //Nasal Flaring
                await page.locator('label').filter({ hasText: /^Nasal Flaring$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Nasal Flaring$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Nasal Flaring$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Nasal Flaring$/ })).not.toBeChecked();
        
                //Oedema
                await page.locator('label').filter({ hasText: /^Oedema$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Oedema$/ })).toBeChecked();
                await expect(page.getByText('* Site').first()).toBeVisible();
                await expect(page.getByText('* Types').nth(2)).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Site This field is required! Fix')).toBeVisible();
                await expect(page.getByText('Types This field is required! Fix')).toBeVisible();
                // await page.locator('#oedemaLocationid_0').click();
                // await expect(page.locator('#oedemaLocationid_0')).toBeChecked();
                // await page.locator('#oedemaLocationid_1').click();
                // await expect(page.locator('#oedemaLocationid_1')).toBeChecked();
                // await page.locator('#oedemaLocationid_2').click();
                // await expect(page.locator('#oedemaLocationid_2')).toBeChecked();
                // await page.locator('#oedemaLocationid_3').click();
                // await expect(page.locator('#oedemaLocationid_3')).toBeChecked();
                // await page.locator('#oedemaLocationid_4').click();
                // await expect(page.locator('#oedemaLocationid_4')).toBeChecked();
                // await page.locator('#oedemaLocationid_5').click();
                // await expect(page.locator('#oedemaLocationid_5')).toBeChecked();
                await page.locator('#oedemaTypeid_0').click();
                await expect(page.locator('#oedemaTypeid_0')).toBeChecked();
                await page.locator('#oedemaTypeid_1').click();
                await expect(page.locator('#oedemaTypeid_1')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Oedema$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Oedema$/ })).not.toBeChecked();
        
                //Oral thrush
                await page.locator('label').filter({ hasText: /^Oral thrush$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Oral thrush$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Oral thrush$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Oral thrush$/ })).not.toBeChecked();
        
                //Pallor
                await page.locator('label').filter({ hasText: /^Pallor$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Pallor$/ })).toBeChecked();
                await expect(page.getByText('*  Pallor Location')).toBeVisible();
                await expect(page.getByText('* Grading').nth(3)).toBeVisible();
                await page.getByRole('button', { name: 'Save and close' }).click();
                await expect(page.getByText('Pallor Location This field is required! Fix')).toBeVisible();
                await expect(page.getByText('Grading This field is required! Fix')).toBeVisible();
                await page.locator('#pallorLocationid_0').click();
                await expect(page.locator('#pallorLocationid_0')).toBeChecked();
                await page.locator('#pallorLocationid_1').click();
                await expect(page.locator('#pallorLocationid_1')).toBeChecked();
                await page.locator('#pallorLocationid_2').click();
                await expect(page.locator('#pallorLocationid_2')).toBeChecked();
                await page.locator('#pallorLocationid_3').click();
                await expect(page.locator('#pallorLocationid_3')).toBeChecked();
                await page.locator('#pallorLocationid_4').click();
                await expect(page.locator('#pallorLocationid_4')).toBeChecked();
                await page.locator('#pallorGradingid_0').click();
                await expect(page.locator('#pallorGradingid_0')).toBeChecked();
                await page.locator('#pallorGradingid_1').click();
                await expect(page.locator('#pallorGradingid_1')).toBeChecked();
                await page.locator('#pallorGradingid_2').click();
                await expect(page.locator('#pallorGradingid_2')).toBeChecked();
                await page.locator('label').filter({ hasText: /^Pallor$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Pallor$/ })).not.toBeChecked();
        
                //Palmar Erythema
                await page.locator('label').filter({ hasText: /^Palmar Erythema$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Palmar Erythema$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Palmar Erythema$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Palmar Erythema$/ })).not.toBeChecked();
        
                //Restless
                await page.locator('label').filter({ hasText: /^Restless$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Restless$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Restless$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Restless$/ })).not.toBeChecked();
        
                //Wasting
                await page.locator('label').filter({ hasText: /^Wasting$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Wasting$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Wasting$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Wasting$/ })).not.toBeChecked();
        
                //general Exam Notes
                await page.locator('#generalExamNotesid').fill(clinicalNotes);
            });
        
            await test.step('When I click on the system examination options', async () => {
                await page.locator('#syStemsRevieWid_0').click();
                await expect(page.locator('#syStemsRevieWid_0')).toBeChecked();
                await page.locator('#syStemsRevieWid_1').click();
                await expect(page.locator('#syStemsRevieWid_1')).toBeChecked();
                await expect(page.getByText('   System Reviews ')).toBeVisible();
            });
        
            await test.step('I should be able to fill the abnormal system reviews', async () => {
                // Abdomen
                await page.locator('label').filter({ hasText: /^Abdominal$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal$/ })).toBeChecked();
                await expect(page.getByText('   Abdomen findings ').nth(1)).toBeVisible();
                await page.locator('label').filter({ hasText: /^Abdominal distension$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal distension$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Abdominal distension$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal distension$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Abdominal mass$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal mass$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Abdominal mass$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal mass$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Splenomegaly$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Splenomegaly$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Splenomegaly$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Splenomegaly$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hepatomegaly$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hepatomegaly$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hepatomegaly$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hepatomegaly$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Abdominal tenderness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal tenderness$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Abdominal tenderness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal tenderness$/ })).not.toBeChecked();
                await page.locator('#abdoMenFindNoteSid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^Abdominal$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abdominal$/ })).not.toBeChecked();
        
                //CNS
                await page.locator('label').filter({ hasText: /^CNS$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^CNS$/ })).toBeChecked();
                await expect(page.getByText('   CNS findings ').nth(1)).toBeVisible();
                await page.locator('label').filter({ hasText: /^Altered sensations$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Altered sensations$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Altered sensations$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Altered sensations$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Limb weakness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Limb weakness$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Limb weakness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Limb weakness$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Bulging fontenelle$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Bulging fontenelle$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Bulging fontenelle$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Bulging fontenelle$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Stiff neck$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Stiff neck$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Stiff neck$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Stiff neck$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Kernicterus$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Kernicterus$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Kernicterus$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Kernicterus$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Abnormal reflexes$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abnormal reflexes$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Abnormal reflexes$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abnormal reflexes$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Confusion$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Confusion$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Confusion$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Confusion$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Kernigs sign$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Kernigs sign$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Kernigs sign$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Kernigs sign$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Brudzinski's sign$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Brudzinski's sign$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Brudzinski's sign$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Brudzinski's sign$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Loss of consciousness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Loss of consciousness$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Loss of consciousness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Loss of consciousness$/ })).not.toBeChecked();
                await page.locator('#CnSNotESid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^CNS$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^CNS$/ })).not.toBeChecked();
        
                //CVS
                await page.locator('label').filter({ hasText: /^CVS$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^CVS$/ })).toBeChecked();
                await expect(page.getByText('   CVS findings ').first()).toBeVisible();
                await page.locator('label').filter({ hasText: /^Cardiac murmur$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cardiac murmur$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Cardiac murmur$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cardiac murmur$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Cardiac rub$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cardiac rub$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Cardiac rub$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cardiac rub$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Irregular heartbeat$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Irregular heartbeat$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Irregular heartbeat$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Irregular heartbeat$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Elevated blood pressure$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Elevated blood pressure$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Elevated blood pressure$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Elevated blood pressure$/ })).not.toBeChecked();
                //await page.locator('#CnSNotESid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^CVS$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^CVS$/ })).not.toBeChecked();
        
                //ENT
                await page.locator('label').filter({ hasText: /^ENT$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^ENT$/ })).toBeChecked();
                await expect(page.getByText('   ENT findings ').nth(1)).toBeVisible();
                await page.locator('label').filter({ hasText: /^Ulcers$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Ulcers$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Ulcers$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Ulcers$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hoarseness$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hoarseness$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hoarseness$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hoarseness$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Oral sores$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Oral sores$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Oral sores$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Oral sores$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Vertigo$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Vertigo$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Vertigo$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Vertigo$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Nasal discharge$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Nasal discharge$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Nasal discharge$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Nasal discharge$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Toothache$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Toothache$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Toothache$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Toothache$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Frequent colds$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Frequent colds$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Frequent colds$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Frequent colds$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Apnea$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Apnea$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Apnea$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Apnea$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Thrush$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Thrush$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Thrush$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Thrush$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Nosebleed$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Nosebleed$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Nosebleed$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Nosebleed$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Sinus problems$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Sinus problems$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Sinus problems$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Sinus problems$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Pain$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Pain$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Pain$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Pain$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Dental caries$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Dental caries$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Dental caries$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Dental caries$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Erythema$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Erythema$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Erythema$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Erythema$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Snoring$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Snoring$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Snoring$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Snoring$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Tinnitus$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Tinnitus$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Tinnitus$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Tinnitus$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Sore thoat$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Sore thoat$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Sore thoat$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Sore thoat$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Masses$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Masses$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Masses$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Masses$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hearing disorder$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hearing disorder$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hearing disorder$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hearing disorder$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Gingival bleeding$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Gingival bleeding$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Gingival bleeding$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Gingival bleeding$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hearing loss$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hearing loss$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hearing loss$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Hearing loss$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Post nasal discharge$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Post nasal discharge$/ }).first()).toBeChecked();
                await page.locator('label').filter({ hasText: /^Post nasal discharge$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^Post nasal discharge$/ }).first()).not.toBeChecked();
                await page.locator('#EntfinDingsNotesid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^ENT$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^ENT$/ })).not.toBeChecked();
        
                //Endocrine
                await page.locator('label').filter({ hasText: /^Endocrine$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Endocrine$/ })).toBeChecked();
                await expect(page.getByText('   Endocrine findings ').nth(1)).toBeVisible();
                await page.locator('label').filter({ hasText: /^Moon Face$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Moon Face$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Moon Face$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Moon Face$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Gigantism$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Gigantism$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Gigantism$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Gigantism$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Bossing of forehead$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Bossing of forehead$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Bossing of forehead$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Bossing of forehead$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Supraclavicular fat pads$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Supraclavicular fat pads$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Supraclavicular fat pads$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Supraclavicular fat pads$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Short Stature$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Short Stature$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Short Stature$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Short Stature$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Thoracocervical fat pads (buffalo hump)' }).click();
                await expect(page.locator('label').filter({ hasText: 'Thoracocervical fat pads (buffalo hump)' })).toBeChecked();
                await page.locator('label').filter({ hasText: 'Thoracocervical fat pads (buffalo hump)' }).click();
                await expect(page.locator('label').filter({ hasText: 'Thoracocervical fat pads (buffalo hump)' })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Prominent jaw$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Prominent jaw$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Prominent jaw$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Prominent jaw$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Protrusion of the lower jaw (prognathism)' }).click();
                await expect(page.locator('label').filter({ hasText: 'Protrusion of the lower jaw (prognathism)' })).toBeChecked();
                await page.locator('label').filter({ hasText: 'Protrusion of the lower jaw (prognathism)' }).click();
                await expect(page.locator('label').filter({ hasText: 'Protrusion of the lower jaw (prognathism)' })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Enlarged nose$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Enlarged nose$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Enlarged nose$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Enlarged nose$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Thickened lips$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Thickened lips$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Thickened lips$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Thickened lips$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Macroglossia$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Macroglossia$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Macroglossia$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Macroglossia$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Crowded Teeth$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Crowded Teeth$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Crowded Teeth$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Crowded Teeth$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Thickened skin$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Thickened skin$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Thickened skin$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Thickened skin$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hirsutism$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hirsutism$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hirsutism$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hirsutism$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hyperpigmentation of Skin$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hyperpigmentation of Skin$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hyperpigmentation of Skin$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hyperpigmentation of Skin$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Central Obesity$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Central Obesity$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Central Obesity$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Central Obesity$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Acanthosis nigricans$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Acanthosis nigricans$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Acanthosis nigricans$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Acanthosis nigricans$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Thyroid Enlargment$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Thyroid Enlargment$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Thyroid Enlargment$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Thyroid Enlargment$/ })).not.toBeChecked();
                await page.locator('#EndofinDingsNotesid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^Endocrine$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Endocrine$/ })).not.toBeChecked();
        
                //Eye
                await page.locator('label').filter({ hasText: /^Eye$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Eye$/ })).toBeChecked();
                await expect(page.getByText('   Eyes findings ').nth(1)).toBeVisible();
                await page.locator('label').filter({ hasText: /^Visual Disturbance$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Visual Disturbance$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Visual Disturbance$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Visual Disturbance$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Eye pain$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Eye pain$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Eye pain$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Eye pain$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Light sensitive$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Light sensitive$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Light sensitive$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Light sensitive$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Excessive tearing$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Excessive tearing$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Excessive tearing$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Excessive tearing$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Eye redness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Eye redness$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Eye redness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Eye redness$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Itchy eyes$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Itchy eyes$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Itchy eyes$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Itchy eyes$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Scotomota$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Scotomota$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Scotomota$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Scotomota$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Cataracts$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cataracts$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Cataracts$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Cataracts$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Double vision$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Double vision$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Double vision$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Double vision$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Blurred vision$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Blurred vision$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Blurred vision$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Blurred vision$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Perobital edema$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Perobital edema$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Perobital edema$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Perobital edema$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Conjuctival pallor$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Conjuctival pallor$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Conjuctival pallor$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Conjuctival pallor$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Sclerae Jaundice$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Sclerae Jaundice$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Sclerae Jaundice$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Sclerae Jaundice$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Xanthelasma$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Xanthelasma$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Xanthelasma$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Xanthelasma$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Exophthalmosis$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Exophthalmosis$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Exophthalmosis$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Exophthalmosis$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Ptosis of lids$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Ptosis of lids$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Ptosis of lids$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Ptosis of lids$/ })).not.toBeChecked();
                await page.locator('#EyeFinDingNotesid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^Eye$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Eye$/ })).not.toBeChecked();
        
                //Genitourinary
                await page.locator('label').filter({ hasText: /^Genitourinary$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Genitourinary$/ })).toBeChecked();
                await expect(page.getByText('   Genitourinary findings ').nth(1)).toBeVisible();
                await page.locator('label').filter({ hasText: /^Urethral discharge$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Urethral discharge$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Urethral discharge$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Urethral discharge$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Rectal discharge$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Rectal discharge$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Rectal discharge$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Rectal discharge$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Bleeding$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Bleeding$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Bleeding$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Bleeding$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Ulceration$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Ulceration$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Ulceration$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Ulceration$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Vaginal discharge$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Vaginal discharge$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Vaginal discharge$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Vaginal discharge$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Inguinal Swelling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Inguinal Swelling$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Inguinal Swelling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Inguinal Swelling$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Genital rashes/Lesions'}).click();
                await expect(page.locator('label').filter({ hasText: 'Genital rashes/Lesions'})).toBeChecked();
                await page.locator('label').filter({ hasText: 'Genital rashes/Lesions'}).click();
                await expect(page.locator('label').filter({ hasText: 'Genital rashes/Lesions'})).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Warts$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Warts$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Warts$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Warts$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Scrotal mass$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Scrotal mass$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Scrotal mass$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Scrotal mass$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Testicular mass$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Testicular mass$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Testicular mass$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Testicular mass$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hypospadias$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hypospadias$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hypospadias$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hypospadias$/ })).not.toBeChecked();
                await page.locator('#GenItouriNaryFinoTeSid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^Genitourinary$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Genitourinary$/ })).not.toBeChecked();
        
                //Musculoskeletal
                await page.locator('label').filter({ hasText: /^Musculoskeletal$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Musculoskeletal$/ })).toBeChecked();
                await expect(page.getByText('   Musculoskeletal findings ').nth(1)).toBeVisible();
                await page.locator('label').filter({ hasText: 'Abnormal Posture/Movement'}).click();
                await expect(page.locator('label').filter({ hasText: 'Abnormal Posture/Movement'})).toBeChecked();
                await page.locator('label').filter({ hasText: 'Abnormal Posture/Movement'}).click();
                await expect(page.locator('label').filter({ hasText: 'Abnormal Posture/Movement'})).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Deformity$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Deformity$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Deformity$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Deformity$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Restriction of movement$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Restriction of movement$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Restriction of movement$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Restriction of movement$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Muscle Wasting$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Muscle Wasting$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Muscle Wasting$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Muscle Wasting$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Diffuse pain and tenderness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Diffuse pain and tenderness$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Diffuse pain and tenderness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Diffuse pain and tenderness$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Swelling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Swelling$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Swelling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Swelling$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Ulcers$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^Ulcers$/ }).nth(1)).toBeChecked();
                await page.locator('label').filter({ hasText: /^Ulcers$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^Ulcers$/ }).nth(1)).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Increased of local temperature$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Increased of local temperature$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Increased of local temperature$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Increased of local temperature$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Heberdens nodes$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Heberdens nodes$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Heberdens nodes$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Heberdens nodes$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Pitting/Non pitting oedema'}).click();
                await expect(page.locator('label').filter({ hasText: 'Pitting/Non pitting oedema'})).toBeChecked();
                await page.locator('label').filter({ hasText: 'Pitting/Non pitting oedema'}).click();
                await expect(page.locator('label').filter({ hasText: 'Pitting/Non pitting oedema'})).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Tendon sheath crepitus$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Tendon sheath crepitus$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Tendon sheath crepitus$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Tendon sheath crepitus$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Joint crepitus$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Joint crepitus$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Joint crepitus$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Joint crepitus$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Joint stiffness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Joint stiffness$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Joint stiffness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Joint stiffness$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Muscle weakness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Muscle weakness$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Muscle weakness$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Muscle weakness$/ })).not.toBeChecked();
                await page.locator('#musculoskeletalFindingNotesid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^Musculoskeletal$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Musculoskeletal$/ })).not.toBeChecked();
        
                //Respiratory
                await page.locator('label').filter({ hasText: /^Respiratory$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Respiratory$/ })).toBeChecked();
                if(age>5) {
                    await expect(page.getByText('   Respiratory findings ').first()).toBeVisible();
                    await page.locator('label').filter({ hasText: /^Wheezing$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Wheezing$/ }).first()).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Wheezing$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Wheezing$/ }).first()).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Respiratory distress$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Respiratory distress$/ }).first()).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Respiratory distress$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Respiratory distress$/ }).first()).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Crackles$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Crackles$/ }).first()).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Crackles$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Crackles$/ }).first()).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Dullness$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Dullness$/ }).first()).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Dullness$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Dullness$/ }).first()).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Reduced breathing$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Reduced breathing$/ }).first()).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Reduced breathing$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Reduced breathing$/ }).first()).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).first()).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).first().click();
                    await expect(page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).first()).not.toBeChecked();
                }
                if(age<=5) {
                    await expect(page.getByText('   Respiratory findings ').nth(1)).toBeVisible();
                    await page.locator('label').filter({ hasText: /^Wheezing$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Wheezing$/ }).nth(1)).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Wheezing$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Wheezing$/ }).nth(1)).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Respiratory distress$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Respiratory distress$/ }).nth(1)).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Respiratory distress$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Respiratory distress$/ }).nth(1)).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Crackles$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Crackles$/ }).nth(1)).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Crackles$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Crackles$/ }).nth(1)).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Dullness$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Dullness$/ }).nth(1)).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Dullness$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Dullness$/ }).nth(1)).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Reduced breathing$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Reduced breathing$/ }).nth(1)).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Reduced breathing$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Reduced breathing$/ }).nth(1)).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).nth(1)).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).nth(1).click();
                    await expect(page.locator('label').filter({ hasText: /^Bronchial breathing$/ }).nth(1)).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Grunting$/ }).click();
                    await expect(page.locator('label').filter({ hasText: /^Grunting$/ })).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Grunting$/ }).click();
                    await expect(page.locator('label').filter({ hasText: /^Grunting$/ })).not.toBeChecked();
                    await page.locator('label').filter({ hasText: /^Stridor$/ }).click();
                    await expect(page.locator('label').filter({ hasText: /^Stridor$/ })).toBeChecked();
                    await page.locator('label').filter({ hasText: /^Stridor$/ }).click();
                    await expect(page.locator('label').filter({ hasText: /^Stridor$/ })).not.toBeChecked();
                    await page.locator('label').filter({ hasText: 'Chest in-drawing' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Chest in-drawing' })).toBeChecked();
                    await page.locator('label').filter({ hasText: 'Chest in-drawing' }).click();
                    await expect(page.locator('label').filter({ hasText: 'Chest in-drawing' })).not.toBeChecked();
                }
                //await page.locator('#musculoskeletalFindingNotesid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^Respiratory$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Respiratory$/ })).not.toBeChecked();
    
                //skin
                await page.locator('label').filter({ hasText: /^Skin$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Skin$/ })).toBeChecked();
                await expect(page.getByText('   Skin findings ').first()).toBeVisible();
                await page.locator('label').filter({ hasText: 'Swelling/Growth'}).click();
                await expect(page.locator('label').filter({ hasText: 'Swelling/Growth'})).toBeChecked();
                await page.locator('label').filter({ hasText: 'Swelling/Growth'}).click();
                await expect(page.locator('label').filter({ hasText: 'Swelling/Growth'})).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Skin eruptions/Rashes'}).click();
                await expect(page.locator('label').filter({ hasText: 'Skin eruptions/Rashes'})).toBeChecked();
                await page.locator('label').filter({ hasText: 'Skin eruptions/Rashes'}).click();
                await expect(page.locator('label').filter({ hasText: 'Skin eruptions/Rashes'})).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Hair Loss$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hair Loss$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Hair Loss$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Hair Loss$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Oral sores$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^Oral sores$/ }).nth(1)).toBeChecked();
                await page.locator('label').filter({ hasText: /^Oral sores$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^Oral sores$/ }).nth(1)).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).nth(1)).toBeChecked();
                await page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).nth(1)).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Itching$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Itching$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Itching$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Itching$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Abscess$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abscess$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Abscess$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Abscess$/ })).not.toBeChecked();
                await page.locator('#SkInNotesid').fill(clinicalNotes);
                await page.locator('label').filter({ hasText: /^Skin$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Skin$/ })).not.toBeChecked();
            });
        
            await test.step('I should be able to add a clinical diahnosis', async () => {
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.locator('input[type="text"]').fill('Malaria');
                await page.getByText('MALARIA', { exact: true }).click();
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.getByRole('button', { name: 'Remove' }).nth(1).click();
                await page.getByRole('button', { name: 'Remove' }).click();
            });
        
            await test.step('I should be able to add and investigation', async () => {
                await page.locator('#investigationOrderdid_0').click();
                await expect(page.locator('#investigationOrderdid_0')).toBeChecked();
                await expect(page.getByText('Add lab order')).toBeVisible();
        
                // consider adding click on add lab order and return back to form
        
                await page.locator('#investigationOrderdid_1').click();
                await expect(page.locator('#investigationOrderdid_1')).toBeChecked();
            });
        
            await test.step('When I click next to go to Patient management, the sections should be visible', async () => {
                await page.getByText('NextPatient Management').click();
                await expect(page.getByRole('button', { name: ' Diagnosis ' })).toBeVisible();
                await expect(page.getByRole('button', { name: ' Treatment/Management Plan ' })).toBeVisible();
            });
        
            await test.step('I should be able to add a final diagnosis', async () => {
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.getByRole('textbox').fill('Malaria');
                await page.getByText('MALARIA', { exact: true }).click();
                await page.getByRole('button', { name: 'Add', exact: true }).click();
                await page.getByRole('button', { name: 'Remove' }).nth(1).click();
                await page.getByRole('button', { name: 'Remove' }).click();
            });
        
            //consider adding clicking of add drug order and return back to form
        
            await test.step('When I click check on the none under therapies prescribed, the options should disable', async () => {
                await page.locator('label').filter({ hasText: /^None$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).toBeChecked();
                await expect(page.locator('label').filter({ hasText: /^Support Groups$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Behavioral Therapy$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Occupational Therapy$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Pain Management$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Physiotherapy$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Respiratory Therapy$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Other' }).first()).toBeDisabled();
            });
        
            await test.step('When I uncheck the none option, I should be able to fill the section', async () => {
                await page.locator('label').filter({ hasText: /^None$/ }).first().click();
                await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Support Groups$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Support Groups$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Support Groups$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Support Groups$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Behavioral Therapy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Behavioral Therapy$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Behavioral Therapy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Behavioral Therapy$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Occupational Therapy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Occupational Therapy$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Occupational Therapy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Occupational Therapy$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Pain Management$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Pain Management$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Pain Management$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Pain Management$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Physiotherapy' }).click();
                await expect(page.locator('label').filter({ hasText: 'Physiotherapy' })).toBeChecked();
                await page.locator('label').filter({ hasText: 'Physiotherapy' }).click();
                await expect(page.locator('label').filter({ hasText: 'Physiotherapy' })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Respiratory Therapy' }).click();
                await expect(page.locator('label').filter({ hasText: 'Respiratory Therapy' })).toBeChecked();
                await page.locator('label').filter({ hasText: 'Respiratory Therapy' }).click();
                await expect(page.locator('label').filter({ hasText: 'Respiratory Therapy' })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Other' }).first().click();
                await expect(page.locator('label').filter({ hasText: 'Other' }).first()).toBeChecked();
                await expect(page.locator('#otherTherapiesOrderdid')).toBeEmpty();
                await page.locator('label').filter({ hasText: 'Other' }).first().click();
                await expect(page.locator('label').filter({ hasText: 'Other' }).first()).not.toBeChecked();
            });
        
            await test.step('When I check the none in any counselling prescribed, they should be disabled', async () => {
                await page.locator('label').filter({ hasText: /^None$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^None$/ }).nth(1)).toBeChecked();
                await expect(page.locator('label').filter({ hasText: /^Family Counseling$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^ Nutritional and Diatary$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Psychosocial therapy$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: /^Substance Abuse Counseling$/ })).toBeDisabled();
                await expect(page.locator('label').filter({ hasText: 'Other' }).nth(3)).toBeDisabled();
            });
        
            await test.step('When I uncheck the none option, I should be able to fill the section', async () => {
                await page.locator('label').filter({ hasText: /^None$/ }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: /^None$/ }).nth(1)).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Family Counseling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Family Counseling$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Family Counseling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Family Counseling$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^ Nutritional and Diatary$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^ Nutritional and Diatary$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^ Nutritional and Diatary$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^ Nutritional and Diatary$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Psychosocial therapy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Psychosocial therapy$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Psychosocial therapy$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Psychosocial therapy$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: /^Substance Abuse Counseling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Substance Abuse Counseling$/ })).toBeChecked();
                await page.locator('label').filter({ hasText: /^Substance Abuse Counseling$/ }).click();
                await expect(page.locator('label').filter({ hasText: /^Substance Abuse Counseling$/ })).not.toBeChecked();
                await page.locator('label').filter({ hasText: 'Other' }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: 'Other' }).nth(1)).toBeChecked();
                await expect(page.locator('#otherCounlOrderedid')).toBeEmpty();
                await page.locator('label').filter({ hasText: 'Other' }).nth(1).click();
                await expect(page.locator('label').filter({ hasText: 'Other' }).nth(1)).not.toBeChecked();
            });
        
            await test.step('I Should be able to fill the patient outcome section', async () => {
                await page.locator('#outcomePatientid_0').click();
                await expect(page.locator('#outcomePatientid_0')).toBeChecked();
                await expect(page.getByText(' Add appointments ')).toBeVisible();
        
                //consider adding clicking the add appointment button and return back to form 
        
                //Adminssion
                await page.locator('#outcomePatientid_1').click();
                await expect(page.locator('#outcomePatientid_1')).toBeChecked();
                await expect(page.getByText(' Admission Details ')).toBeVisible();
                await page.locator('#dateOfPatientAdmissionid').fill('34/34/3034'); //fill invalid date
                await page.mouse.click(100, 200);
                await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
                await page.locator('#dateOfPatientAdmissionid').fill(getFutureDateFormatted());
                await page.mouse.click(100, 200);
                await expect(page.locator('p').filter({ hasText: 'Future date is not allowed!' })).toBeVisible();
                await page.locator('#dateOfPatientAdmissionid').fill(getCurrentDateFormatted());
                await page.mouse.click(100, 200);
                await page.locator('#admiPatientReasonid').fill(clinicalNotes);
                await page.locator('#admissionTypeid_0').click();
                await expect(page.locator('#admissionTypeid_0')).toBeChecked();
                await page.locator('#admissionTypeid_1').click();
                await expect(page.locator('#admissionTypeid_1')).toBeChecked();
                await page.locator('#priorityOfAdmissionReadmitid_0').click();
                await expect(page.locator('#priorityOfAdmissionReadmitid_0')).toBeChecked();
                await page.locator('#priorityOfAdmissionReadmitid_1').click();
                await expect(page.locator('#priorityOfAdmissionReadmitid_1')).toBeChecked();
                await page.locator('#priorityOfAdmissionReadmitid_2').click();
                await expect(page.locator('#priorityOfAdmissionReadmitid_2')).toBeChecked();
                if(age > 12 && gender === 'M') {
                    await page.locator('#admissionWardMaleid').selectOption('b665252a-06f5-401b-872b-d197e79cfc65'); //add male patients
                }
                if(age > 12 && gender === 'F') {
                    await page.locator('#admissionWardFemaleid').selectOption('0d0ff617-7e40-475c-b010-2376c8a13684'); //female patients
                }
                if(age >= 0.0766613962 && age <= 12) {
                    await page.locator('#admissionWardChildid').selectOption('385e4ad3-be6b-4b71-bb46-12f494d7fe3e'); //child patients
                }
                if(age < 0.0766613962) {
                    await page.locator('#admissionWardneonatesid').selectOption('a7fe93d1-2fd3-4738-acf8-d98626efe4a2'); //neonate patients
                }
                await page.locator('#hospitalStayid_0').click();
                await expect(page.locator('#hospitalStayid_0')).toBeChecked();
                await page.locator('#hospitalStayid_1').click();
                await expect(page.locator('#hospitalStayid_1')).toBeChecked();
                await page.locator('#hospitalStayid_2').click();
                await expect(page.locator('#hospitalStayid_2')).toBeChecked();
                await page.locator('[id="admittingDoctor\\ id"]').getByRole('textbox').fill('Quality');
                await page.getByText('quality').click();
        
                //referral
                await page.locator('#outcomePatientid_2').click();
                await expect(page.locator('#outcomePatientid_2')).toBeChecked();
                await expect(page.getByText('   Reffered For? ')).toBeVisible();
                await page.locator('#refferalsOrderdid').fill(clinicalNotes);
                await page.locator('#referralToid').selectOption('164407AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await expect(page.getByText('   Transfer to Facility: ')).toBeVisible();
                await page.locator('#transferToFacilityid').getByRole('textbox').fill('Bamburi');
                await page.getByText('Bamburi Dispensary').click();
                await page.locator('#referralToid').selectOption('163266AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                await expect(page.getByText('   This Facility: ')).toBeVisible();
                await expect(page.locator('#thisfacilityid')).not.toBeEmpty();
                await page.locator('#outcomePatientid_3').click();
                await expect(page.locator('#outcomePatientid_3')).toBeChecked();
                await page.locator('#outcomePatientid_0').click();
                await expect(page.locator('#outcomePatientid_0')).toBeChecked();
            });
        
            await test.step('When I click the save and close button the form should save', async () => {
                await page.getByRole('button', { name: 'Save and close' }).click();
                await await page.waitForTimeout(500);
                await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
            });
        });
    });
}