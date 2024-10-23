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
    await page.locator('#\\30genExamFindingsid').selectOption('143050AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    await expect(page.locator('#\\30genExamFindingsid')).toBeChecked();
    // await page.locator('#1genExamFindingsid').check();
    // await expect(page.locator('#1genExamFindingsid')).toBeChecked();
    // await page.locator('#2genExamFindingsid').check();
    // await expect(page.locator('#2genExamFindingsid')).toBeChecked();
    // await page.locator('#3genExamFindingsid').check();
    // await expect(page.locator('#3genExamFindingsid')).toBeChecked();
    // await page.locator('#4genExamFindingsid').check();
    // await expect(page.locator('#4genExamFindingsid')).toBeChecked();
    // await page.locator('#5genExamFindingsid').check();
    // await expect(page.locator('#5genExamFindingsid')).toBeChecked();
    // await page.locator('#6genExamFindingsid').check();
    // await expect(page.locator('#6genExamFindingsid')).toBeChecked();
    // await page.locator('#7genExamFindingsid').check();
    // await expect(page.locator('#7genExamFindingsid')).toBeChecked();
    // await page.locator('#8genExamFindingsid').check();
    // await expect(page.locator('#8genExamFindingsid')).toBeChecked();
    // await page.locator('#9genExamFindingsid').check();
    // await expect(page.locator('#9genExamFindingsid')).toBeChecked();
    // await page.locator('#10genExamFindingsid').check();
    // await expect(page.locator('#10genExamFindingsid')).toBeChecked();
    // await page.locator('#11genExamFindingsid').check();
    // await expect(page.locator('#11genExamFindingsid')).toBeChecked();
    // await page.locator('#12genExamFindingsid').check();
    // await expect(page.locator('#12genExamFindingsid')).toBeChecked();
    // await page.locator('#13genExamFindingsid').check();
    // await expect(page.locator('#13genExamFindingsid')).toBeChecked();

});
