import { expect } from "@playwright/test";

import { PatientIdentifierType, type Visit } from "@openmrs/esm-framework";

import { test } from "../../core";
import {
  generateRandomPatient,
  getPatientIdentifiers,
  type Patient,
  startVisit
} from "../../commands";
import { ChartPage, VisitsPage } from "../../pages";

let patient: Patient;
let visit: Visit;



test.beforeEach(async ({ api }) => {
  // let patienttypes = await getPatientIdentifiers(api);

  /*let uuid = patienttypes?.results.find(
    (x) => x.display === "OpenMRS ID"
  )?.uuid;*/
  patient = await generateRandomPatient(api, "F", '1977-11-01');

  visit = await startVisit(api, patient.uuid);
});

test("Fill HTS Self Test Form", async ({ page }) => {
  const chartPage = new ChartPage(page);
  const visitsPage = new VisitsPage(page);

  await test.step("When I visit the chart summary page", async () => {
    await chartPage.goTo(patient.uuid);
  });

  await test.step("And I click the `Clinical forms` button on the siderail", async () => {
    await page.getByLabel(/clinical forms/i, { exact: true }).click();
  });
  await test.step("Then I should see the clinical forms workspace", async () => {
    const headerRow = chartPage.formsTable().locator("thead > tr");

    await expect(page.getByPlaceholder(/Search this list/i)).toBeVisible();
    await expect(headerRow).toContainText(/form name \(a-z\)/i);
    await expect(headerRow).toContainText(/last completed/i);

    await expect(
      page.getByRole("cell", { name: "HIV Self Test Form", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", {
        name: "HTS Eligibility Screening Form",
        exact: true,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "HTS Initial Form", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "HTS Retest Form", exact: true })
    ).toBeVisible();
  });

  await test.step("When I click the `HIV Self Test Form` link to launch the form", async () => {
    await page.getByText(/HIV Self Test Form/i).click();
  });

  await test.step("Then I should see the `HIV Self Test Form` form launch in the workspace", async () => {
    await expect(page.getByText(/HIV Self Test Form/i)).toBeVisible();
  });

  await test.step("Selecting the general population", async () => {
    await page.getByLabel("General Population").click();
    // await page.locator('input#populationTypeid_0').click();
  });

  await test.step("Selecting Ever Tested for HIV", async () => {
    const elementvalue = await page.locator("input[name=everTestedid]");
    const elementcount = await elementvalue.count();
    for (var index = 0; index < elementcount; index++) {
      const element = await elementvalue.nth(index);
      const innerText = await element.getAttribute("value");

      expect(["1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"]).toContain(innerText);



      if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
        await element.click();
      }
    }

    // await page.locator('input#everTestedid_1').click();
  });

  await test.step("Validating knowledge of HIV Status and selcting value as negative", async () => {
    const elementvalue = await page.locator("input[name=testResultsid]");
    const elementcount = await elementvalue.count();
    for (var index = 0; index < elementcount; index++) {
      const element = await elementvalue.nth(index);
      const innerText = await element.getAttribute("value");

      expect(["703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "1175AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"]).toContain(innerText);


      if (innerText == "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
        await element.click();
      }
    }
  });
  await test.step("Validating the HIV self test questions and selecting the value as yes", async () => {
    const elementvalue = await page.locator("input[name=selfTestEverid]");
    const elementcount = await elementvalue.count();
    for (var index = 0; index < elementcount; index++) {
      const element = await elementvalue.nth(index);
      const innerText = await element.getAttribute("value");

      expect(["1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"]).toContain(innerText);

      if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
        await element.click();
      }
    }

    // await page.locator('input#everTestedid_1').click();
  });

  await test.step("And I click the `Add ` to add the current HIV testing services", async () => {
    await page.getByRole("button", { name: /add/i }).nth(1).click();
  });
  await test.step("should select an option from the select dropdown and assert the value", async () => {

    await page.locator('#reasonForTestid').selectOption({ value: '95e1a7ef-0ae2-468e-893e-a98ade264c2a' });
    const selectedValue = await page.$eval('#reasonForTestid', e => e.value);
    expect(selectedValue).toContain('95e1a7ef-0ae2-468e-893e-a98ade264c2a');

    const optionlist = page.locator('#reasonForTestid');

    const options = await page.$$eval('#reasonForTestid > option', (els) => {
      return els.map(option => option.getAttribute("value"))
    })
    //console.log(options);
    await expect(options).toEqual(expect.arrayContaining(['95e1a7ef-0ae2-468e-893e-a98ade264c2a', '163568AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', '5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA']));



  });

  await test.step("should select an option of the testkit and assert the value", async () => {

    await page.locator('#nameOfKitid').selectOption({ value: '2f5a80fa-6f26-4832-b8a8-f47649bb60de' });
    const selectedValue = await page.$eval('#nameOfKitid', e => e.value);
    expect(selectedValue).toContain('2f5a80fa-6f26-4832-b8a8-f47649bb60de');

    const optionlist = page.locator('#nameOfKitid');

    const options = await page.$$eval('#nameOfKitid > option', (els) => {
      return els.map(option => option.getAttribute("value"))
    })
    //console.log(options);
    await expect(options).toEqual(expect.arrayContaining(['2f5a80fa-6f26-4832-b8a8-f47649bb60de', '7cf927f8-e734-474f-b71a-1459bb566aa2', '160240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', '1920AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', '59ef8c87-eb66-4f9e-a459-7227c01f682e', '5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA']));



  });


  await test.step('fill the KIT Lot Number', async () => {
    await page.locator('#kitLotNumberid').fill('XDF4444');
  })

  await test.step('Fill the expiry date', async () => {
    await page.locator('#expiryDateid').fill('04/07/2026');
  })

  await test.step('And I click on the `Save` button', async () => {
    await page.getByRole('button', { name: /save/i }).click();
  });

  await test.step('Then I should see a success notification', async () => {
    await expect(page.getByText(/The form has been submitted successfully./i)).toBeVisible();
  });

  await test.step('And I should not see any error messages', async () => {
    await expect(page.getByText('error')).not.toBeVisible();
  });

  await test.step('And if I navigate to the visits dashboard', async () => {
    await visitsPage.gotoVisitsPage(patient.uuid);
  });

  await test.step('Then I should see the newly filled form in the encounters table', async () => {
    await expect(page.getByRole('tab', { name: /Visits/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /All encounters/i })).toBeVisible();

    await page.getByRole('tab', { name: /^encounters$/i }).click();

    const headerRow = page.getByRole('table').locator('thead > tr');

    await expect(headerRow).toContainText(/date & time/i);
    await expect(headerRow).toContainText(/encounter type/i);
    await expect(headerRow).toContainText(/provider/i);

    await page.getByRole('table').locator('th#expand').click();

    await expect(page.getByText('Patient had HIV self test')).toBeVisible();
    await expect(page.getByText('Population type')).toBeVisible();
    await expect(page.getByText('HIV test performed')).toBeVisible();

  });

});
