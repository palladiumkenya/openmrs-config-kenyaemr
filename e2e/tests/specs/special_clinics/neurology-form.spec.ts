import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit } from '../../commands';
import { test } from '../../core';
import { SpecialClinicPage } from '../../pages';
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

test.beforeEach(async ({ api }) => {
    const gender = 'M';
    const age = 30; // Set the age to 30 years
    const currentYear = new Date().getFullYear();
    const birthdate = `${currentYear - age}-06-15`;

    patient = await generateRandomPatient(api, gender, birthdate);
    console.log('Patient created:', patient);
    visit = await startVisit(api, patient.uuid);
});

test('Neurology Form Test With Loss of conscoiusness admitted', async ({ page, api }) => {
    const specialClinic = new SpecialClinicPage(page);
    page.on('dialog', dialog => dialog.accept());

    await test.step('When I visit the Neurology page', async () => {
        await specialClinic.gotoNeurologyPage(patient.uuid);
        await expect(specialClinic.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/special-clinics-dashboard?clinic=neurology-clinic`);
        await expect(page.getByRole('heading', { name: 'Neurology clinic' })).toBeVisible();
    });

    await test.step('I should be able to click the record neurology link', async () => {
        await page.getByRole('button', { name: 'Record neurology clinic' }).click();
        await expect(page.getByText('Neurology form')).toBeVisible();
    });

    await test.step('I should be able to fill the visit deatils', async () => {
        await page.locator('#visitTypeid_2').click();
        await page.locator('#referralSpecificationid_2').click();
        await expect(page.getByText('Specify Referring Department')).toBeVisible();
        await page.locator('#departmentSpecifyid_14').click();
    });

    await test.step('I should be able to click next and fill the patient history', async () => {
        await page.getByText('NextPatient History').click();
        await page.locator('#complaintsTodayid_0').click();
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#cOmplaIntFieldid').selectOption('840AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#complaint-durationid').fill('1');
        await page.locator('#onsetStatusid').selectOption('162707AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#ClinICNotesid').fill(clinicalNotes);
    });

    await test.step('I should be able to click next and fill the patient examination', async () => {
        await page.getByText('NextPatient Examination').click();
        await page.locator('label').filter({ hasText: /^None$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).toBeChecked();
        await expect(page.locator('label').filter({ hasText: /^Restlessness$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Loss of consciousness$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Other \(Specify\)$/ })).toBeDisabled();
    });

    await test.step('I should be able to fill general examination', async () => {
        await page.locator('label').filter({ hasText: /^None$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).not.toBeChecked();
        await page.locator('label').filter({ hasText: /^Restlessness$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Restlessness$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Loss of consciousness$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Loss of consciousness$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Other \(Specify\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Other \(Specify\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Alert' }).click();
        await expect(page.locator('label').filter({ hasText: 'Alert' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Responds to Voice (V)' }).click();
        await expect(page.locator('label').filter({ hasText: 'Responds to Voice (V)' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Responds to Pain (P)' }).click();
        await expect(page.locator('label').filter({ hasText: 'Responds to Pain (P)' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Unresponsive (U)' }).click();
        await expect(page.locator('label').filter({ hasText: 'Unresponsive (U)' })).toBeChecked();
        await page.locator('#generalExamNotesid').fill(clinicalNotes);
    });

    await test.step('I should be able to fill system examination', async () => {
        await page.locator('#syStemsRevieWid_0').click();
    });

    await test.step('I should be able to fill Nystagmus Types ', async () => {
        await page.locator('label').filter({ hasText: 'Vestibular' }).click();
        await expect(page.locator('label').filter({ hasText: 'Vestibular' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Pendular' }).click();
        await expect(page.locator('label').filter({ hasText: 'Pendular' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Optokinetic' }).click();
        await expect(page.locator('label').filter({ hasText: 'Optokinetic' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Upbeat' }).click();
        await expect(page.locator('label').filter({ hasText: 'Upbeat' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Downbeat' }).click();
        await expect(page.locator('label').filter({ hasText: 'Downbeat' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Gaze-evoked' }).click();
        await expect(page.locator('label').filter({ hasText: 'Gaze-evoked' })).toBeChecked();
        await page.locator('#oTcraniaLid').fill(clinicalNotes);
        await page.locator('#moTorSiTeid').fill(clinicalNotes);
    });

    await test.step('I should be able to add clinical diagnosis', async () => {
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#clinicalDiagnosisIdid').getByRole('textbox').fill('Malaria');
        await page.getByText('MALARIA').first().click();
        await page.locator('#investigationOrderdid_1').click();
    });

    await test.step('I should be able to click next and fill Patient Management', async () => {
        await page.getByText('NextPatient Management').click();
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#finalDiagnosisIdid').getByRole('textbox').fill('Malaria');
        await page.getByText('MALARIA').first().click();
        await page.locator('label').filter({ hasText: /^None$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).toBeChecked();
        await expect(page.locator('label').filter({ hasText: /^Support Groups$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Behavioral Therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Occupational Therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Pain Management$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Physiotherapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Respiratory Therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).first()).toBeDisabled();
    });

    await test.step('I should be able to fill the therapies prescribed', async () => {
        await page.locator('label').filter({ hasText: /^None$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).not.toBeChecked();
        await page.locator('label').filter({ hasText: /^Support Groups$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Support Groups$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Behavioral Therapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Behavioral Therapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Occupational Therapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Occupational Therapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Pain Management$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Pain Management$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Physiotherapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Physiotherapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Respiratory Therapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Respiratory Therapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Other$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).first()).toBeChecked();
    });

    await test.step('I should be able to fill the counselling prescribed ', async () => {
        await page.locator('label').filter({ hasText: /^None$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).nth(1)).toBeChecked();
        await expect(page.locator('label').filter({ hasText: /^Family Counseling$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^ Nutritional and Diatary$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Psychosocial therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Substance Abuse Counseling$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).nth(1)).toBeDisabled();
        await page.locator('label').filter({ hasText: /^None$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).nth(1)).not.toBeChecked();
        await page.locator('label').filter({ hasText: 'Family Counseling' }).click();
        await expect(page.locator('label').filter({ hasText: 'Family Counseling' })).toBeChecked();
        await page.locator('label').filter({ hasText: ' Nutritional and Diatary' }).click();
        await expect(page.locator('label').filter({ hasText: ' Nutritional and Diatary' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Psychosocial therapy' }).click();
        await expect(page.locator('label').filter({ hasText: 'Psychosocial therapy' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Substance Abuse Counseling' }).click();
        await expect(page.locator('label').filter({ hasText: 'Substance Abuse Counseling' })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Other$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).nth(1)).toBeChecked();
    });

    await test.step('I should be able to fill patient outcome', async () => {
        await page.locator('#outcomePatientid_1').click();
        await expect(page.getByRole('button', { name: 'Admission Details' })).toBeVisible();
        await page.locator('#dateOfPatientAdmissionid').fill(getCurrentDateFormatted());
        await page.locator('#admiPatientReasonid').fill(clinicalNotes);
        await page.locator('#admissionTypeid_0').click();
        await page.locator('#priorityOfAdmissionid_1').click();
        await page.locator('#dispositionid_0').click();
        await page.locator('#admitToLocationid').getByRole('textbox').fill('male');
        await page.getByText('Male').first().click();
        await page.locator('#hospitalStayid_1').click();
        await page.locator('[id="admittingDoctor\\ id"]').getByRole('textbox').fill('quality');
        await page.getByText('quality').first().click();
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
    });
});

test('Neurology Form Test Without Loss of conscoiusness Released', async ({ page, api }) => {
    const specialClinic = new SpecialClinicPage(page);
    page.on('dialog', dialog => dialog.accept());

    await test.step('When I visit the Neurology page', async () => {
        await specialClinic.gotoNeurologyPage(patient.uuid);
        await expect(specialClinic.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/special-clinics-dashboard?clinic=neurology-clinic`);
        await expect(page.getByRole('heading', { name: 'Neurology clinic' })).toBeVisible();
    });

    await test.step('I should be able to click the record neurology link', async () => {
        await page.getByRole('button', { name: 'Record neurology clinic' }).click();
        await expect(page.getByText('Neurology form')).toBeVisible();
    });

    await test.step('I should be able to fill the visit deatils', async () => {
        await page.locator('#visitTypeid_2').click();
        await page.locator('#referralSpecificationid_2').click();
        await expect(page.getByText('Specify Referring Department')).toBeVisible();
        await page.locator('#departmentSpecifyid_14').click();
    });

    await test.step('I should be able to click next and fill the patient history', async () => {
        await page.getByText('NextPatient History').click();
        await page.locator('#complaintsTodayid_0').click();
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#cOmplaIntFieldid').selectOption('840AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#complaint-durationid').fill('1');
        await page.locator('#onsetStatusid').selectOption('162707AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await page.locator('#ClinICNotesid').fill(clinicalNotes);
    });
    
    await test.step('I should be able to click next and fill the patient examination', async () => {
        await page.getByText('NextPatient Examination').click();
        await page.locator('label').filter({ hasText: /^None$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).toBeChecked();
        await expect(page.locator('label').filter({ hasText: /^Restlessness$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Loss of consciousness$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Other \(Specify\)$/ })).toBeDisabled();
    });
    
    await test.step('I should be able to fill general examination', async () => {
        await page.locator('#eyeOpeningResponseid_0').click();
        await page.locator('#verbalResponseid_0').click();
        await page.locator('label').filter({ hasText: /^Obeys commands$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Obeys commands$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Localizes pain$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Localizes pain$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Normal flexion \(Withdraw\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Normal flexion \(Withdraw\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Abnormal flexion \(decorticate\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Abnormal flexion \(decorticate\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Extension \(decerebrate\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Extension \(decerebrate\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^None \(flaccid\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^None \(flaccid\)$/ })).toBeChecked();
        await page.locator('#glasgowComaScaleid').fill('15');
        await page.locator('label').filter({ hasText: /^Neck stiffness$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Neck stiffness$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Brudzinski’s sign positive$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Brudzinski’s sign positive$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Kernig’s sign positive$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Kernig’s sign positive$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Lhermitte’s phenomenon$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Lhermitte’s phenomenon$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Dysarthria$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Dysarthria$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Dysphonia$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Dysphonia$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Dysphasia$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Dysphasia$/ })).toBeChecked();
        await page.locator('#generalExamNotesid').fill(clinicalNotes);
    });

    await test.step('I should be able to fill system examination', async () => {
        await page.locator('#syStemsRevieWid_1').click();
        await expect(page.locator('span').filter({ hasText: 'Cranial Nerves II, III, IV,' }).first()).toBeVisible();
        await expect(page.getByText('Cranial Nerves II, III, IV, and VI Examination').first()).toBeVisible();
        await expect(page.getByText('Cranial Nerve V (Trigeminal Nerve) Examination').first()).toBeVisible();
        await expect(page.getByText('Head').first()).toBeVisible();
        await expect(page.getByText('Cranial Nerve VII (Facial Nerve) Examination').first()).toBeVisible();
        await expect(page.getByText('Cranial Nerve XII (Hypoglossal Nerve) Examination').first()).toBeVisible();
        await expect(page.getByText('Motor System Examination').first()).toBeVisible();
    });

    await test.step('Cranial Nerve I Examination', async () => {
        await page.locator('label').filter({ hasText: /^Cranial Nerve I Examination$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Cranial Nerve I Examination$/ })).toBeChecked();
        await expect(page.getByText('   Cranial Nerve I (Olfactory Nerve) Examination ')).toBeVisible();
        
        await page.locator('#cranialNerveIExaminationid_1').click();
        await page.locator('label').filter({ hasText: /^Bilateral$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Bilateral$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Unilateral$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Unilateral$/ })).toBeChecked();
    });
    
    await test.step('Cranial Nerves II, III, IV, and VI Examination', async () => {
        await page.locator('label').filter({ hasText: /^Cranial Nerves II, III, IV, and VI Examination$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Cranial Nerves II, III, IV, and VI Examination$/ })).toBeChecked();
        await expect(page.getByText('Cranial Nerves II, III, IV,').nth(1)).toBeVisible();
        
        await page.locator('label').filter({ hasText: /^Visual Acuity$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Visual Acuity$/ })).toBeChecked();

        await page.locator('label').filter({ hasText: /^Loss of colour vision$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Loss of colour vision$/ })).toBeChecked();
        await page.locator('#eyeInvolvementAid_2').click();

        await page.locator('label').filter({ hasText: /^Constricted pupils$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Constricted pupils$/ })).toBeChecked();
        await page.locator('#eyeInvolvementBid_2').click();

        await page.locator('label').filter({ hasText: /^Dilated pupil$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Dilated pupil$/ })).toBeChecked();
        await page.locator('#eyeInvolvementCid_2').click();
        
        await page.locator('label').filter({ hasText: /^Failure of constriction of the pupil to light$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Failure of constriction of the pupil to light$/ })).toBeChecked();
        await page.locator('#eyeInvolvementDid_2').click();
        
        await page.locator('label').filter({ hasText: /^Non-reactive pupil$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Non-reactive pupil$/ })).toBeChecked();
        await page.locator('#eyeInvolvementEid_2').click();
        
        await page.locator('label').filter({ hasText: /^Pupillary oscillation$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Pupillary oscillation$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Anisocoria$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Anisocoria$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Tonic pupil$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Tonic pupil$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Small, irregular, unequal pupils$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Small, irregular, unequal pupils$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Papilloedema$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Papilloedema$/ })).toBeChecked();
        
        await page.locator('label').filter({ hasText: /^Nystagmus$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Nystagmus$/ })).toBeChecked();
        await page.locator('#eyeInvolvementFid_2').click();
        
        await page.locator('label').filter({ hasText: /^Ophthalmoplegia$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Ophthalmoplegia$/ })).toBeChecked();
        await page.locator('#eyeInvolvementGid_2').click();
        
        await page.locator('label').filter({ hasText: /^Strabismus$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Strabismus$/ })).toBeChecked();
        await page.locator('#eyeInvolvementHid_2').click();
        
        await page.locator('label').filter({ hasText: /^Limited gaze$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Limited gaze$/ })).toBeChecked();
        await page.locator('#eyeInvolvementJid_2').click();
        
        await page.locator('label').filter({ hasText: /^Squint$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Squint$/ })).toBeChecked();
        await page.locator('#eyeInvolvementIid_2').click();
        
        await page.locator('label').filter({ hasText: /^Ptosis$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Ptosis$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Optic disc swelling$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Optic disc swelling$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Optic disc cupping$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Optic disc cupping$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Optic atrophy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Optic atrophy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Retinal hemorrhage$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Retinal hemorrhage$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Central or branch retinal artery occlusion$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Central or branch retinal artery occlusion$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Central or branch retinal vein occlusion$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Central or branch retinal vein occlusion$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Unilateral miotic pupil$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Unilateral miotic pupil$/ })).toBeChecked();
    });

    await test.step('Cranial Nerve V (Trigeminal Nerve) Examination', async () => {
        await page.locator('label').filter({ hasText: /^Cranial Nerve V \(Trigeminal Nerve\) Examination$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Cranial Nerve V \(Trigeminal Nerve\) Examination$/ })).toBeChecked();
        await expect(page.getByText('Cranial Nerve V (Trigeminal').nth(1)).toBeVisible();

        await page.locator('label').filter({ hasText: /^Normal sensation$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Normal sensation$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Reduced sensation$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Reduced sensation$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Absent sensation$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Absent sensation$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Trigeminal neuralgia$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Trigeminal neuralgia$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Weakness of mastication muscles$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Weakness of mastication muscles$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Jaw deviation$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Jaw deviation$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Corneal reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Corneal reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Jaw deviation to the affected side$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Jaw deviation to the affected side$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Wasting of muscle$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Wasting of muscle$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Loss of all sensory modalities$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Loss of all sensory modalities$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Loss of light touch$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Loss of light touch$/ })).toBeChecked();

        await page.locator('label').filter({ hasText: /^Postural abnormalities$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Postural abnormalities$/ })).toBeChecked();
        
        await page.locator('label').filter({ hasText: /^Tremors$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Tremors$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Rest$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Rest$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Postural$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Postural$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Action$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Action$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Rubral tremor$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Rubral tremor$/ })).toBeChecked();

        await page.locator('label').filter({ hasText: /^Chorea$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Chorea$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Athetosis$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Athetosis$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Dystonia$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^Dystonia$/ }).first()).toBeChecked();
        await page.locator('label').filter({ hasText: /^Myoclonus$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Myoclonus$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Tics$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Tics$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Pyramidal drift$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Pyramidal drift$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Cerebellar drift$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Cerebellar drift$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Parietal drift$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Parietal drift$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Tetany$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Tetany$/ })).toBeChecked();
                
        await page.locator('label').filter({ hasText: /^Shoulder$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Shoulder$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Elbow$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Elbow$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Wrist$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Wrist$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Fingers$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Fingers$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Hip$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Hip$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Knee$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^Knee$/ }).first()).toBeChecked();
        await page.locator('label').filter({ hasText: /^Ankle$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Ankle$/ })).toBeChecked();
        
        await page.locator('label').filter({ hasText: /^Abduction$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Abduction$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Adduction$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Adduction$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Flexion$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Flexion$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Extension$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Extension$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Dorsiflexion$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Dorsiflexion$/ })).toBeChecked();
        
        await page.locator('label').filter({ hasText: /^Biceps reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Biceps reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Triceps reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Triceps reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Brachioradialis reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Brachioradialis reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Patellar reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Patellar reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Achilles reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Achilles reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Finger$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Finger$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Adductor$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Adductor$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Knee$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^Knee$/ }).nth(1)).toBeChecked();
        
        await page.locator('label').filter({ hasText: /^Upper abdominal reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Upper abdominal reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Lower abdominal reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Lower abdominal reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Absent abdominal reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Absent abdominal reflex$/ })).toBeChecked();
        
        await page.locator('label').filter({ hasText: /^Normal plantar reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Normal plantar reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Babinski sign \(upgoing toe\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Babinski sign \(upgoing toe\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Absent plantar reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Absent plantar reflex$/ })).toBeChecked();
        
        await page.locator('label').filter({ hasText: /^Moro reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Moro reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Palmar grasp reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Palmar grasp reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Plantar grasp reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Plantar grasp reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Rooting reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Rooting reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Sucking reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Sucking reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Tonic neck reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Tonic neck reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Glabellar tap$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Glabellar tap$/ })).toBeChecked();
        await page.locator('#glabFindingsid_0').click();
        await page.locator('label').filter({ hasText: /^Palmomental reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Palmomental reflex$/ })).toBeChecked();
        await page.locator('#pAlFindingsid_1').click();
        await page.locator('label').filter({ hasText: /^Grasp reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Grasp reflex$/ })).toBeChecked();
        await page.locator('#grAspFindingsid_1').click();
        await page.locator('label').filter({ hasText: /^Snout \(or pout\) reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Snout \(or pout\) reflex$/ })).toBeChecked();
        await page.locator('#snOutFindingsid_1').click();
        await page.locator('label').filter({ hasText: /^Suckling reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Suckling reflex$/ })).toBeChecked();
        await page.locator('#suCkFindingsid_1').click();
        
        await page.locator('label').filter({ hasText: /^Hemiplegic$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Hemiplegic$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Scissoring$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Scissoring$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Parkinsonism$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Parkinsonism$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Cerebellar$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Cerebellar$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Sensory ataxia$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Sensory ataxia$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Waddling$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Waddling$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^High-stepping$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^High-stepping$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Apraxic$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Apraxic$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Spastic gait$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Spastic gait$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Functional$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Functional$/ })).toBeChecked();
    });
    
    await test.step('Head', async () => {
        await page.locator('label').filter({ hasText: /^Head$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Head$/ })).toBeChecked();
    });
    
    await test.step('Cranial Nerve VII (Facial Nerve) Examination', async () => {
        await page.locator('label').filter({ hasText: /^Cranial Nerve VII \(Facial Nerve\) Examination$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Cranial Nerve VII \(Facial Nerve\) Examination$/ })).toBeChecked();
        await expect(page.getByText('Cranial Nerve VII (Facial Nerve) Examination Findings')).toBeVisible();

        await page.locator('label').filter({ hasText: /^Facial asymmetry$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Facial asymmetry$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Whistle-smile negative$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Whistle-smile negative$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Loss of facial movement$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Loss of facial movement$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Loss of forehead wrinkling$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Loss of forehead wrinkling$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Inability to close eyes$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Inability to close eyes$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Incomplete eye closure \(lagophthalmos\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Incomplete eye closure \(lagophthalmos\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Absent blinking reflex$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Absent blinking reflex$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Drooping of the corner of the mouth$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Drooping of the corner of the mouth$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Difficulty pronouncing labial sounds$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Difficulty pronouncing labial sounds$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Loss of nasolabial fold$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Loss of nasolabial fold$/ })).toBeChecked();
    });

    await test.step('Cranial Nerve XII (Hypoglossal Nerve) Examination', async () => {
        await page.locator('label').filter({ hasText: /^Cranial Nerve XII \(Hypoglossal Nerve\) Examination$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Cranial Nerve XII \(Hypoglossal Nerve\) Examination$/ })).toBeChecked();
        await expect(page.getByText('Cranial Nerve XII (Hypoglossal Nerve) Examination Findings')).toBeVisible();

        await page.locator('label').filter({ hasText: /^Tongue deviation to one side$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Tongue deviation to one side$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Atrophy of the tongue$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Atrophy of the tongue$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Fasciculations of the tongue$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Fasciculations of the tongue$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Difficulty with speech \(dysarthria\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Difficulty with speech \(dysarthria\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Difficulty swallowing \(dysphagia\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Difficulty swallowing \(dysphagia\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Fasciculation on the affected side$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Fasciculation on the affected side$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Deviation toward the affected side on protrusion$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Deviation toward the affected side on protrusion$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Muscle atrophy of the affected side of the tongue$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Muscle atrophy of the affected side of the tongue$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Weak tongue with reduced movements$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Weak tongue with reduced movements$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Rapid in-and-out movement on protrusion \(trombone tremor\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Rapid in-and-out movement on protrusion \(trombone tremor\)$/ })).toBeChecked();
    });

    await test.step('Motor System Examination', async () => {
        await page.locator('label').filter({ hasText: /^Motor System Examination$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Motor System Examination$/ })).toBeChecked();
        await expect(page.getByText('   Motor System Inspection ')).toBeVisible();


        await page.locator('label').filter({ hasText: /^Muscle strength$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Muscle strength$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Grade 5: Normal power' }).click();
        await expect(page.locator('label').filter({ hasText: 'Grade 5: Normal power' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Grade 4: Active movement against gravity and resistance' }).click();
        await expect(page.locator('label').filter({ hasText: 'Grade 4: Active movement against gravity and resistance' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Grade 3: Active movement against gravity' }).click();
        await expect(page.locator('label').filter({ hasText: 'Grade 3: Active movement against gravity' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Grade 2: Active movement with gravity eliminated' }).click();
        await expect(page.locator('label').filter({ hasText: 'Grade 2: Active movement with gravity eliminated' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Grade 1: Flicker or trace of contraction' }).click();
        await expect(page.locator('label').filter({ hasText: 'Grade 1: Flicker or trace of contraction' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Grade 0: Complete paralysis' }).click();
        await expect(page.locator('label').filter({ hasText: 'Grade 0: Complete paralysis' })).toBeChecked();

        await page.locator('label').filter({ hasText: /^Muscle tone$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Muscle tone$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Normal$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^Normal$/ }).first()).toBeChecked();
        await page.locator('label').filter({ hasText: /^Spasticity$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Spasticity$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Rigidity$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Rigidity$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Gegenhalten \(paratonia\)$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Gegenhalten \(paratonia\)$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Myotonia$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Myotonia$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Dystonia$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^Dystonia$/ }).nth(1)).toBeChecked();

        await page.locator('label').filter({ hasText: /^Muscle bulk$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Muscle bulk$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Reflexes$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Reflexes$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Coordination$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Coordination$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Gait$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Gait$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Involuntary movements$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Involuntary movements$/ })).toBeChecked();

        await page.locator('label').filter({ hasText: /^Disuse Muscle atrophy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Disuse Muscle atrophy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Muscle hypertrophy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Muscle hypertrophy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Weaknesses$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Weaknesses$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Abnormal positioning$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Abnormal positioning$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Muscle Wasting$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Muscle Wasting$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Fasciculation$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Fasciculation$/ })).toBeChecked();
    });

    await test.step('I should be able to fill Nystagmus Types ', async () => {
        await page.locator('label').filter({ hasText: 'Vestibular' }).click();
        await expect(page.locator('label').filter({ hasText: 'Vestibular' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Pendular' }).click();
        await expect(page.locator('label').filter({ hasText: 'Pendular' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Optokinetic' }).click();
        await expect(page.locator('label').filter({ hasText: 'Optokinetic' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Upbeat' }).click();
        await expect(page.locator('label').filter({ hasText: 'Upbeat' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Downbeat' }).click();
        await expect(page.locator('label').filter({ hasText: 'Downbeat' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Gaze-evoked' }).click();
        await expect(page.locator('label').filter({ hasText: 'Gaze-evoked' })).toBeChecked();
        await page.locator('#oTcraniaLid').fill(clinicalNotes);
        await page.locator('#moTorSiTeid').fill(clinicalNotes);
    });

    await test.step('I should be able to add clinical diagnosis', async () => {
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#clinicalDiagnosisIdid').getByRole('textbox').fill('Malaria');
        await page.getByText('MALARIA').first().click();
        await page.locator('#investigationOrderdid_1').click();
    });

    await test.step('I should be able to click next and fill Patient Management', async () => {
        await page.getByText('NextPatient Management').click();
        await page.getByRole('button', { name: 'Add', exact: true }).click();
        await page.locator('#finalDiagnosisIdid').getByRole('textbox').fill('Malaria');
        await page.getByText('MALARIA').first().click();
        await page.locator('label').filter({ hasText: /^None$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).toBeChecked();
        await expect(page.locator('label').filter({ hasText: /^Support Groups$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Behavioral Therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Occupational Therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Pain Management$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Physiotherapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Respiratory Therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).first()).toBeDisabled();
    });

    await test.step('I should be able to fill the therapies prescribed', async () => {
        await page.locator('label').filter({ hasText: /^None$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).first()).not.toBeChecked();
        await page.locator('label').filter({ hasText: /^Support Groups$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Support Groups$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Behavioral Therapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Behavioral Therapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Lifestyle Modification Programs$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Occupational Therapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Occupational Therapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Pain Management$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Pain Management$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Physiotherapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Physiotherapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Respiratory Therapy$/ }).click();
        await expect(page.locator('label').filter({ hasText: /^Respiratory Therapy$/ })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Other$/ }).first().click();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).first()).toBeChecked();
    });

    await test.step('I should be able to fill the counselling prescribed ', async () => {
        await page.locator('label').filter({ hasText: /^None$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).nth(1)).toBeChecked();
        await expect(page.locator('label').filter({ hasText: /^Family Counseling$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^ Nutritional and Diatary$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Psychosocial therapy$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Substance Abuse Counseling$/ })).toBeDisabled();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).nth(1)).toBeDisabled();
        await page.locator('label').filter({ hasText: /^None$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^None$/ }).nth(1)).not.toBeChecked();
        await page.locator('label').filter({ hasText: 'Family Counseling' }).click();
        await expect(page.locator('label').filter({ hasText: 'Family Counseling' })).toBeChecked();
        await page.locator('label').filter({ hasText: ' Nutritional and Diatary' }).click();
        await expect(page.locator('label').filter({ hasText: ' Nutritional and Diatary' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Psychosocial therapy' }).click();
        await expect(page.locator('label').filter({ hasText: 'Psychosocial therapy' })).toBeChecked();
        await page.locator('label').filter({ hasText: 'Substance Abuse Counseling' }).click();
        await expect(page.locator('label').filter({ hasText: 'Substance Abuse Counseling' })).toBeChecked();
        await page.locator('label').filter({ hasText: /^Other$/ }).nth(1).click();
        await expect(page.locator('label').filter({ hasText: /^Other$/ }).nth(1)).toBeChecked();
    });

    await test.step('I should be able to fill patient outcome', async () => {
        await page.locator('#outcomePatientid_2').click();
        await page.locator('#refferalsOrderdid').fill(clinicalNotes);
        await page.locator('#referralToid').selectOption('163266AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    });

    await test.step('When I click the save and close button the form should save', async () => {
        await page.getByRole('button', { name: 'Save and close' }).click();
        await page.waitForTimeout(500);
        await expect(page.getByText(/The form has been submitted/i)).toBeVisible();
    });
});