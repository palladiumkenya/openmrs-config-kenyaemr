import { test } from '../../core';
import { expect } from '@playwright/test';
import { HomePage } from '../../pages';
import { faker } from '@faker-js/faker';

test('Clinical Encounter Test', async ({ page }) => {
    // Generate random name
    const firstName = faker.person.firstName();
    const middleName = faker.person.middleName();
    const lastName = faker.person.lastName();
    const clinicalNotes = faker.word.words(5);
    const drug = faker.word.words(1);
    const surgery = faker.word.words(2);
    const admission = faker.word.words(3);

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

    //login
    console.log("Login");
    const homePage = new HomePage(page);
    await homePage.gotoHome();

    //create patient
    console.log("create patient");
    await page.getByRole('button', { name: 'Add Patient'}).click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Create new patient' })).toBeVisible();
    await page.fill('#givenName', firstName);
    await page.fill('#middleName', middleName);
    await page.fill('#familyName', lastName);
    await page.locator('fieldset span').nth(2).click();
    await page.getByRole('tab', { name: 'No' }).click();
    await page.fill('#yearsEstimated', '25');
    await page.getByPlaceholder('Search address').fill('bamburi');
    await page.getByText('Mombasa > Kisauni > Bamburi').click();
    await page.getByLabel('Telephone contact').fill('0723000000');
    await page.getByLabel('Location', { exact: true }).fill('Bamburi');
    await page.getByLabel('Sub-location').fill('Bamburi');
    await page.getByLabel('Village').fill('Kiembeni');
    await page.getByLabel('Landmark').fill('Mint');
    await page.getByLabel('Nearest Health Center').fill('Bamburi Dispensary');
    await page.getByLabel('Marital status').selectOption('1057AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByLabel('Occupation').selectOption('1107AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByLabel('Education').selectOption('159785AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByRole('button', { name: 'Post to registry' }).click();
    await page.getByRole('button', { name: 'Register Patient' }).click();
    await page.getByRole('button', { name: 'Start a visit' }).click();
    await page.locator('label').filter({ hasText: 'Outpatient' }).locator('span').first().click();
    await page.getByRole('button', { name: 'Start visit' }).click();
    await expect(page.locator('button:has-text("End visit")')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    //click clinical forms
    console.log("click clinical forms");
    const clinicalFormsButton = page.locator('button[aria-label="Clinical forms"]');
    await clinicalFormsButton.waitFor({ state: 'visible', timeout: 5000 });
    await clinicalFormsButton.click();
    await expect(page.getByText('Clinical Encounter')).toBeVisible();

    //click clinical encounter
    console.log("click clinical encounter form");
    await page.getByText('Clinical Encounter').click();
    await expect(page.getByText('Save and close Discard')).toBeVisible();

    //click save and close
    console.log("click save and close");
    await page.getByRole('button', { name: 'Save and close' }).click();
    //await expect(page.getByText('Visit Type? This field is required! Fix')).toBeVisible();
    await expect(page.getByText('Patient having complaint(s) today? This field is required! Fix')).toBeVisible();
    await expect(page.getByText('Patient has adverse drug reaction(s)? This field is required! Fix')).toBeVisible();
    await expect(page.getByText('General examination findings: This field is required! Fix')).toBeVisible();
    await expect(page.getByText('Finding(s) on systems review? This field is required! Fix')).toBeVisible();

    //Test visit date
    console.log("test visit date");
    await page.locator('#encDateid').fill('34/34/3034'); //fill invalid date
    await page.mouse.click(100, 200);
    await expect(page.locator('div').filter({ hasText: /^Provided date is invalid!$/ }).nth(2)).toBeVisible();
    await page.locator('#encDateid').fill(getFutureDateFormatted());
    await page.mouse.click(100, 200);
    await expect(page.locator('div').filter({ hasText: /^Future date is not allowed!$/ }).nth(2)).toBeVisible();
    await page.locator('#encDateid').fill(getCurrentDateFormatted());
    await page.mouse.click(100, 200);
   
    //I should be able to select visit types
    console.log("select visit type");
    await page.locator('#visitTypeid_0').click();
    await expect(page.locator('#visitTypeid_0')).toBeChecked();
    await page.locator('#visitTypeid_1').click();
    await expect(page.locator('#visitTypeid_1')).toBeChecked();
    await page.locator('#visitTypeid_2').click();
    await expect(page.locator('#visitTypeid_2')).toBeChecked();
    await expect(page.getByText('Visit To:')).toBeVisible();
    await page.locator('#visitToid_0').click();
    await expect(page.locator('#visitToid_0')).toBeChecked();
    
    //When I select inpatient type of visit, the patient history and examination should be empty
    console.log("inpatient visit type test");
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

    //Go back to visit details and select different type of visit
    console.log("Other visit types");
    await page.getByRole('button', { name: 'Visit Details' }).click();
    await expect(page.getByRole('heading', { name: 'Visit Details' })).toBeVisible();
    await page.locator('#visitTypeid_0').click();
    await expect(page.locator('#visitTypeid_0')).toBeChecked();
    await page.getByText('NextPatient History').click();
    await expect(page.getByRole('button', { name: ' Complaints and History of complaints ' })).toBeVisible();
    await expect(page.getByRole('button', { name: ' Past Medical/Surgical History ' })).toBeVisible();
    await expect(page.getByRole('button', { name: ' Adverse Drug Reactions ' })).toBeVisible();
    await expect(page.getByRole('button', { name: ' Sexual and Reproductive History ' })).toBeVisible(); //only for female clients
    await expect(page.getByRole('button', { name: ' Family Planning Status ' })).toBeVisible();

    //presenting complaints
    console.log("Presenting complaints");
    await page.locator('#complaintsTodayid_0').click();
    await expect(page.locator('#complaintsTodayid_0')).toBeChecked();
    await expect(page.getByRole('heading', { name: 'Presenting complaints' })).toBeVisible();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.locator('#cOmplaIntFieldid').selectOption('151AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.locator('#complaint-durationid').fill('14');
    await page.locator('#onsetStatusid').selectOption('1499AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Remove' }).nth(1).click();
    await page.getByRole('button', { name: 'Remove' }).click();
    await page.locator('#complaintsTodayid_1').click();
    await expect(page.locator('#complaintsTodayid_1')).toBeChecked();
    await page.locator('#ClinICNotesid').fill(clinicalNotes);

    //past medical/surgery history
    console.log("past medical/surgery history");
    await page.locator('#medHisid_0').click();
    await expect(page.locator('#medHisid_0')).toBeChecked();
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.locator('#druGid').fill(drug);
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
    await page.locator('#typeofSurgeryid').fill(surgery);
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
    await page.locator('#admiReasonid').fill(admission);
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

    //Adverse drug reaction
    console.log("Adverse drug reaction");
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

    //sexual and reproductive history -- female clients only
    console.log("Sexual and reproductive history female clients");
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
    await page.locator('#otherAmenorrheaid').fill(admission);
    await page.locator('#previousSurgeryGynoid_0').click();
    await expect(page.locator('#previousSurgeryGynoid_0')).toBeChecked();
    await expect(page.getByText('   Name of the procedure ')).toBeVisible();
    await page.locator('#nameOfProcedureOrderdid').fill(admission);
    await page.locator('#previousSurgeryGynoid_1').click();
    await expect(page.locator('#previousSurgeryGynoid_1')).toBeChecked();

    //family planning status
    console.log("family planning status");
    await page.locator('#fPlanningid_0').click();
    await expect(page.locator('#fPlanningid_0')).toBeChecked();
    await page.locator('#fPlanningid_1').click();
    await expect(page.locator('#fPlanningid_1')).toBeChecked();
    await page.locator('#fPlanningid_2').click();
    await expect(page.locator('#fPlanningid_2')).toBeChecked();

    //click next
    console.log("Patient examination");
    await page.getByText('NextPatient Examination').click();
    await expect(page.getByRole('button', { name: ' General Examination Findings ' })).toBeVisible();
    await expect(page.getByRole('button', { name: ' System Examination ' })).toBeVisible();
    await expect(page.getByRole('button', { name: ' Diagnosis ' })).toBeVisible();
    await expect(page.getByRole('button', { name: ' Investigations ' })).toBeVisible();

    //General examination findings
    console.log("General examination findings");
    await page.locator('label').filter({ hasText: /^None$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^None$/ })).toBeChecked();
    await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Dehydration$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Finger Clubbing$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Jaundice$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Lethargic$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Lymph Node Axillary$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Lymph Nodes Inguinal$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Nasal Flaring$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Oedema$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Oral thrush$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Pallor$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Convulsions$/ })).toBeDisabled();
    await expect(page.locator('label').filter({ hasText: /^Wasting$/ })).toBeDisabled();

    await page.locator('label').filter({ hasText: /^None$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^None$/ })).not.toBeChecked();
    await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).toBeEnabled();

    await page.locator('label').filter({ hasText: /^Cyanosis$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Cyanosis$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Cyanosis$/ })).not.toBeChecked();
    
    await page.locator('label').filter({ hasText: /^Dehydration$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Dehydration$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Dehydration$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Dehydration$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Finger Clubbing$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Finger Clubbing$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Finger Clubbing$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Finger Clubbing$/ })).not.toBeChecked();

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
    await page.locator('#jaundiceGradingid_3').click();
    await expect(page.locator('#jaundiceGradingid_3')).toBeChecked();
    await page.locator('label').filter({ hasText: /^Jaundice$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Jaundice$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Lethargic$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Lethargic$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Lethargic$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Lethargic$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Lymph Node Axillary$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Lymph Node Axillary$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Lymph Node Axillary$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Lymph Node Axillary$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Lymph Nodes Inguinal$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Lymph Nodes Inguinal$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Lymph Nodes Inguinal$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Lymph Nodes Inguinal$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Nasal Flaring$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Nasal Flaring$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Nasal Flaring$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Nasal Flaring$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Oedema$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Oedema$/ })).toBeChecked();
    await expect(page.getByText('* Site').first()).toBeVisible();
    await expect(page.getByText('* Grading').nth(1)).toBeVisible();
    await page.getByRole('button', { name: 'Save and close' }).click();
    await expect(page.getByText('Site This field is required! Fix')).toBeVisible();
    await expect(page.getByText('Grading This field is required! Fix')).toBeVisible();
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
    await page.locator('#oedemaGradingid_0').click();
    await expect(page.locator('#oedemaGradingid_0')).toBeChecked();
    await page.locator('#oedemaGradingid_1').click();
    await expect(page.locator('#oedemaGradingid_1')).toBeChecked();
    await page.locator('#oedemaGradingid_2').click();
    await expect(page.locator('#oedemaGradingid_2')).toBeChecked();
    await page.locator('#oedemaGradingid_3').click();
    await expect(page.locator('#oedemaGradingid_3')).toBeChecked();
    await page.locator('label').filter({ hasText: /^Oedema$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Oedema$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Oral thrush$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Oral thrush$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Oral thrush$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Oral thrush$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Pallor$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Pallor$/ })).toBeChecked();
    await expect(page.getByText('* Grading').nth(2)).toBeVisible();
    await page.getByRole('button', { name: 'Save and close' }).click();
    await expect(page.getByText('Grading This field is required! Fix')).toBeVisible();
    await page.locator('#pallorGradingid_0').click();
    await expect(page.locator('#pallorGradingid_0')).toBeChecked();
    await page.locator('#pallorGradingid_1').click();
    await expect(page.locator('#pallorGradingid_1')).toBeChecked();
    await page.locator('#pallorGradingid_2').click();
    await expect(page.locator('#pallorGradingid_2')).toBeChecked();
    await page.locator('#pallorGradingid_3').click();
    await expect(page.locator('#pallorGradingid_3')).toBeChecked();
    await page.locator('label').filter({ hasText: /^Pallor$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Pallor$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Convulsions$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Convulsions$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Convulsions$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Convulsions$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Wasting$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Wasting$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Wasting$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Wasting$/ })).not.toBeChecked();

    await page.locator('#generalExamNotesid').fill(clinicalNotes);

    //system examination
    console.log("system examination");
    await page.locator('#syStemsRevieWid_0').click();
    await expect(page.locator('#syStemsRevieWid_0')).toBeChecked();
    await page.locator('#syStemsRevieWid_1').click();
    await expect(page.locator('#syStemsRevieWid_1')).toBeChecked();
    await expect(page.getByText('   System Reviews ')).toBeVisible();

    await page.locator('label').filter({ hasText: /^Abdominal$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Abdominal$/ })).toBeChecked();
    await expect(page.getByText('   Abdomen findings ')).toBeVisible();
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

    await page.locator('label').filter({ hasText: /^CNS$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^CNS$/ })).toBeChecked();
    await expect(page.getByText('   CNS findings ')).toBeVisible();
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

    await page.locator('label').filter({ hasText: /^CVS$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^CVS$/ })).toBeChecked();
    await expect(page.getByText('   CVS findings ')).toBeVisible();
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

    await page.locator('label').filter({ hasText: /^ENT$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^ENT$/ })).toBeChecked();
    await expect(page.getByText('   ENT findings ')).toBeVisible();
    await page.locator('label').filter({ hasText: /^Ulcers$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Ulcers$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Ulcers$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Ulcers$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Hoarseness$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hoarseness$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Hoarseness$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hoarseness$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Oral sores$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Oral sores$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Oral sores$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Oral sores$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Vertigo$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Vertigo$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Vertigo$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Vertigo$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Nasal discharge$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Nasal discharge$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Nasal discharge$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Nasal discharge$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Toothache$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Toothache$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Toothache$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Toothache$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Frequent colds$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Frequent colds$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Frequent colds$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Frequent colds$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Apnea$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Apnea$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Apnea$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Apnea$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Thrush$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Thrush$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Thrush$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Thrush$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Nosebleed$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Nosebleed$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Nosebleed$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Nosebleed$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Sinus problems$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Sinus problems$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Sinus problems$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Sinus problems$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Pain$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Pain$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Pain$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Pain$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Dental caries$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Dental caries$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Dental caries$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Dental caries$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Erythema$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Erythema$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Erythema$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Erythema$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hairy cell leukoplakia$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Snoring$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Snoring$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Snoring$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Snoring$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Tinnitus$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Tinnitus$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Tinnitus$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Tinnitus$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Kaposis Sarcoma$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Sore thoat$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Sore thoat$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Sore thoat$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Sore thoat$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Masses$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Masses$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Masses$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Masses$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Hearing disorder$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hearing disorder$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Hearing disorder$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hearing disorder$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Gingival bleeding$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Gingival bleeding$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Gingival bleeding$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Gingival bleeding$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Hearing loss$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hearing loss$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Hearing loss$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Hearing loss$/ })).not.toBeChecked();
    await page.locator('label').filter({ hasText: /^Post nasal discharge$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Post nasal discharge$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Post nasal discharge$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Post nasal discharge$/ })).not.toBeChecked();
    await page.locator('#EntfinDingsNotesid').fill(clinicalNotes);
    await page.locator('label').filter({ hasText: /^ENT$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^ENT$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Eye$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Eye$/ })).toBeChecked();
    await expect(page.getByText('   Eyes findings ')).toBeVisible();
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

    await page.locator('label').filter({ hasText: /^Genitourinary$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Genitourinary$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Genitourinary$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Genitourinary$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Musculoskeletal$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Musculoskeletal$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Musculoskeletal$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Musculoskeletal$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Respiratory$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Respiratory$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Respiratory$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Respiratory$/ })).not.toBeChecked();

    await page.locator('label').filter({ hasText: /^Skin$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Skin$/ })).toBeChecked();
    await page.locator('label').filter({ hasText: /^Skin$/ }).click();
    await expect(page.locator('label').filter({ hasText: /^Skin$/ })).not.toBeChecked();

});
