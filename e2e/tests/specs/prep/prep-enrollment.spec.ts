import { expect } from '@playwright/test';
import { generateRandomPatient, startVisit, generateNegativePatient, generateTriageEncounter } from '../../commands';
import { test } from '../../core';
import { VisitsPage } from '../../pages';
import { faker } from '@faker-js/faker';

let patient: any;
let visit: any;
let negativePatient: any;
let triage: any;

// Define gender and age combinations
const genderAgeScenarios = [
    { gender: 'F', age: 25 }
    // { gender: 'M', age: 25 },
    // { gender: 'M', age: 4 }
];

for (const { gender, age } of genderAgeScenarios) {
    test.describe(`PrEP Test for Gender=${gender}, Age=${age}`, () => {
        test.beforeEach(async ({ page, api }) => {
            const currentYear = new Date().getFullYear();
            const birthdate = `${currentYear - age}-06-15`;

            patient = await generateRandomPatient(api, gender, birthdate);
            console.log('Patient created:', patient);
            visit = await startVisit(api, patient.uuid);
            await page.waitForTimeout(1000);
            negativePatient = await generateNegativePatient(api, patient.uuid, visit.uuid);
            triage = await generateTriageEncounter(api, patient.uuid, visit.uuid);
        });
        
        test('PrEP Enrollment Test', async ({ page }) => {
            const visitsPage = new VisitsPage(page);
            await test.step('When I visit the patient visits page', async () => {
                await visitsPage.gotoVisitsPage(patient.uuid);
                await expect(visitsPage.page).toHaveURL(`${process.env.E2E_BASE_URL}/spa/patient/${patient.uuid}/chart/Visits`);
            });

            await test.step('And I click on ', async () => {
                
            });
        });
    });
}