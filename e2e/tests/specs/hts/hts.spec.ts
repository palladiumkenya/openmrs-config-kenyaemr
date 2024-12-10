import { expect } from "@playwright/test";

import { PatientIdentifierType, type Visit } from "@openmrs/esm-framework";

import { test } from "../../core";
import {
  generateRandomPatient,
  getPatientIdentifiers,
  type Patient,
  startVisit,
  endVisit,
} from "../../commands";
import { ChartPage, VisitsPage } from "../../pages";
import { el, faker } from "@faker-js/faker/.";

let patient: Patient;
let visit: Visit;
const testData = [
 
  
  { gender: "M", birthdate: "2015-11-22", patient: "Patient3" },
  { gender: "F", birthdate: "2010-11-22", patient: "Patient2" },

  
];

testData.forEach((x) => {
  test.beforeEach(async ({ api }) => {
    let patienttypes = await getPatientIdentifiers(api);

    let uuid = patienttypes?.results.find(
      (x) => x.display === "OpenMRS ID"
    )?.uuid;
    patient = await generateRandomPatient(api, uuid, x.gender, x.birthdate);
    visit = await startVisit(api, patient.uuid);
  });

  test(`Fill HTS Eligibility Screening Form  ${x.patient}`, async ({
    page,
  }) => {
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

      await expect(page.getByPlaceholder(/search this list/i)).toBeVisible();
      await expect(headerRow).toContainText(/form name \(a-z\)/i);
      await expect(headerRow).toContainText(/last completed/i);

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

    await test.step("When I click the `HTS Eligibility Screening Form` link to launch the form", async () => {
      await page.getByText(/HTS Eligibility Screening Form/i).click();
    });

    await test.step("Then I should see the `HTS Eligibility Screening Form` form launch in the workspace", async () => {
      await expect(
        page.getByText(/HTS Eligibility Screening Form/i)
      ).toBeVisible();
    });
    await test.step("Should assert the population type concept types", async () => {
      const locator = page.locator("#populationTypeid").locator("option");

      /* const options = await page.$$eval('#populationTypeid > option', (els) => {
      return els.map(option => option.getAttribute('value'));
    })*/
      let options: any[] = [];

      const elementcount = await locator.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await locator.nth(index);
        const innerText = await element.getAttribute("value");
        options.push(innerText);
      }

      if (options.length > 0) {
        await expect(options).toEqual(
          expect.arrayContaining([
            "5d308c8c-ad49-45e1-9885-e5d09a8e5587",
            "bf850dd4-309b-4cbd-9470-9d8110ea5550",
            "138643AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ])
        );
      }
    });
    await test.step("Selecting general population type option and asserting  the value", async () => {
      await page
        .locator("#populationTypeid")
        .selectOption({ value: "5d308c8c-ad49-45e1-9885-e5d09a8e5587" });
      const selectedValue = await page.$eval(
        "#populationTypeid",
        (e) => e.value
      );
      expect(selectedValue).toContain("5d308c8c-ad49-45e1-9885-e5d09a8e5587");
    });

    await test.step("Validating the disability question and asserting the values when yes is selected", async () => {
      const elementvalue = await page.locator("input[name=DisabilityClienTid]");
      const elementcount = await elementvalue.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await elementvalue.nth(index);
        const innerText = await element.getAttribute("value");

        expect([
          "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ]).toContain(innerText);

        if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
          await element.click();
        }
      }
    });

    await test.step("Checking the disability options and checking on the values", async () => {
      const locator = await page.getByText("Visual impairment");
      locator.check();
      const elementsvalue = [];
      const disability1 = await page
        .locator("//input[@id='1disaBilityTypesid']")
        .getAttribute("value");
      elementsvalue.push(disability1);
      const disability2 = await page
        .locator("//input[@id='2disaBilityTypesid']")
        .getAttribute("value");
      elementsvalue.push(disability2);
      const disability3 = await page
        .locator("//input[@id='3disaBilityTypesid']")
        .getAttribute("value");
      elementsvalue.push(disability3);
      const disability4 = await page
        .locator("//input[@id='4disaBilityTypesid']")
        .getAttribute("value");
      elementsvalue.push(disability4);

      await expect(elementsvalue).toEqual(
        expect.arrayContaining([
          "147215AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "151342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "164538AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ])
      );
      await expect(locator).toBeChecked();
    });
    await test.step("Asserting the department concept values", async () => {
      const options = await page.$$eval("#patDepartid > option", (els) => {
        return els.map((option) => option.getAttribute("value"));
      });
      //console.log(options);
      await expect(options).toEqual(
        expect.arrayContaining([
          "160542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "5485AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160473AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160538AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "159940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "163488AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ])
      );
    });

    await test.step("Selecting the outpatient department", async () => {
      await page
        .locator("#patDepartid")
        .selectOption({ value: "160542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" });
      const selectedValue = await page.$eval("#patDepartid", (e) => e.value);
      expect(selectedValue).toContain("160542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    });

    await test.step("Selecting the hospital type after asserting the concepts", async () => {
      const elementvalue = await page.locator("input[name=patienTyPeid]");
      const elementcount = await elementvalue.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await elementvalue.nth(index);
        const innerText = await element.getAttribute("value");

        expect([
          "164163AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "06f16792-9611-40d4-82ec-9615930cc486",
        ]).toContain(innerText);

        if (innerText == "164163AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
          await element.click();
        }
      }
    });

    await test.step("Asserting the client health worker question and selecting one of the option", async () => {
      //test.skip(patient.person.age  < 17 ,'Not applicable');
      if (patient.person.age > 17) {
        const elementvalue = await page.locator("input[name=hcwCareid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();
          }
        }
      }
    });

    await test.step("Asserting the client relationship concepts and select the  None option", async () => {
      if (patient.person.age > 10) {
        const elementsvalue = [];
        const clientrel1option = await page.locator(
          "//input[@id='0cricAdulTid']"
        );
        const clientrel2option = await page.locator(
          "//input[@id='1cricAdulTid']"
        );
        const clientrel3option = await page.locator(
          "//input[@id='2cricAdulTid']"
        );
        const clientrel4option = await page.locator(
          "//input[@id='3cricAdulTid']"
        );

        const clientrel1 = await page
          .locator("//input[@id='0cricAdulTid']")
          .getAttribute("value");
        elementsvalue.push(clientrel1);
        const clientrel2 = await page
          .locator("//input[@id='1cricAdulTid']")
          .getAttribute("value");
        elementsvalue.push(clientrel2);
        const clientrel3 = await page
          .locator("//input[@id='2cricAdulTid']")
          .getAttribute("value");
        elementsvalue.push(clientrel3);
        const clientrel4 = await page
          .locator("//input[@id='3cricAdulTid']")
          .getAttribute("value");
        elementsvalue.push(clientrel4);
        await expect(elementsvalue).toEqual(
          expect.arrayContaining([
            "1107AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "163565AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "166606AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "166517AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ])
        );

        await page.evaluate("document.getElementById('0cricAdulTid').click()");
        //await page.click('id=0cricAdulTid');

        await expect(clientrel2option).toBeDisabled();
        await expect(clientrel3option).toBeDisabled();
        await expect(clientrel3option).toBeDisabled();
        await expect(clientrel4option).toBeDisabled();
      } else {
        const elementsvalue = [];
        const clientrel1option = await page.locator(
          "//input[@id='0cricChildid']"
        );
        const clientrel2option = await page.locator(
          "//input[@id='1cricChildid']"
        );
        const clientrel3option = await page.locator(
          "//input[@id='2cricChildid']"
        );

        const clientrel1 = await page
          .locator("//input[@id='0cricChildid']")
          .getAttribute("value");
        elementsvalue.push(clientrel1);
        const clientrel2 = await page
          .locator("//input[@id='1cricChildid']")
          .getAttribute("value");
        elementsvalue.push(clientrel2);
        const clientrel3 = await page
          .locator("//input[@id='2cricChildid']")
          .getAttribute("value");
        elementsvalue.push(clientrel3);

        await expect(elementsvalue).toEqual(
          expect.arrayContaining([
            "1107AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "166517AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "166606AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ])
        );

        await page.evaluate("document.getElementById('0cricChildid').click()");

        //await page.click('id=0cricAdulTid');

        await expect(clientrel2option).toBeDisabled();
        await expect(clientrel3option).toBeDisabled();
        await expect(clientrel3option).toBeDisabled();
      }
    });

    await test.step("Asserting the  HTS strategy concepts", async () => {
      const options = await page.$$eval(
        "#facilityHTStrategyid > option",
        (els) => {
          return els.map((option) => option.getAttribute("value"));
        }
      );
      //console.log(options);
      await expect(options).toEqual(
        expect.arrayContaining([
          "164163AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "06f16792-9611-40d4-82ec-9615930cc486",
          "d650368d-0228-4493-b7c3-25bd1c74b462",
          "159939AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "161557AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "166606AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ])
      );
    });

    await test.step("Selecting  Integrated VCT strategy", async () => {
      await page
        .locator("#facilityHTStrategyid")
        .selectOption({ value: "d650368d-0228-4493-b7c3-25bd1c74b462" });
      const selectedValue = await page.$eval(
        "#facilityHTStrategyid",
        (e) => e.value
      );
      expect(selectedValue).toContain("d650368d-0228-4493-b7c3-25bd1c74b462");
    });

    await test.step("Asserting the entry point concepts", async () => {
      const options = await page.$$eval(
        "#htsFacilityEntryPointid > option",
        (els) => {
          return els.map((option) => option.getAttribute("value"));
        }
      );
      //console.log(options);
      await expect(options).toEqual(
        expect.arrayContaining([
          "5485AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "162181AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160552AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160538AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160456AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "1623AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160541AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "159940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "162223AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160546AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "160522AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ])
      );
    });
    await test.step("Selecting  VCT as the option in the Entrypoint", async () => {
      await page
        .locator("#htsFacilityEntryPointid")
        .selectOption({ value: "159940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" });
      const selectedValue = await page.$eval(
        "#htsFacilityEntryPointid",
        (e) => e.value
      );
      expect(selectedValue).toContain("159940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    });

    await test.step("Selecting the tested HIVBefore", async () => {
      const elementvalue = await page.locator("input[name=testHistoryid]");
      const elementcount = await elementvalue.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await elementvalue.nth(index);
        const innerText = await element.getAttribute("value");

        expect([
          "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ]).toContain(innerText);

        if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
          await element.click();
          await expect(page.locator("//input[@id='0teSteRid']")).toBeVisible();
          await expect(page.locator("//input[@id='1teSteRid']")).toBeVisible();
        }
      }
    });

    await test.step("Selecting the details of the person that performed the test", async () => {
      await page.evaluate("document.getElementById('0teSteRid').click()");

      await expect(page.locator("#testedResultsproviderid")).toBeVisible();
      await expect(page.locator("#dateProviderid")).toBeVisible();

      await page
        .locator("#testedResultsproviderid")
        .selectOption({ value: "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" });
      await page.locator("#dateProviderid").fill("10/10/2024");
    });

    await test.step("Selecting Mother's HIV status", async () => {
      if (patient.person.age <= 10) {
        const malnutrition = await page.locator(
          "//input[@id='0EligiBiliTykiDsid']"
        );
        const failuretothrive = await page.locator(
          "//input[@id='1EligiBiliTykiDsid']"
        );
        const RecurrentInfections = await page.locator(
          "//input[@id='2EligiBiliTykiDsid']"
        );
        const TB = await page.locator("//input[@id='3EligiBiliTykiDsid']");
        const noparent = await page.locator(
          "//input[@id='4EligiBiliTykiDsid']"
        );
        const parentsiblinghivpositive = await page.locator(
          "//input[@id='5EligiBiliTykiDsid']"
        );
        const prolongedfever = await page.locator(
          "//input[@id='6EligiBiliTykiDsid']"
        );
        const breastfeeding = await page.locator(
          "//input[@id='7EligiBiliTykiDsid']"
        );
        const elementvalue = await page.locator(
          "input[name=motHersHivstatusid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();
            expect(malnutrition).toBeVisible();
            expect(failuretothrive).toBeVisible();
            expect(RecurrentInfections).toBeVisible();
            expect(TB).toBeVisible();
            expect(noparent).toBeVisible();
            expect(parentsiblinghivpositive).toBeVisible();
            expect(prolongedfever).toBeVisible();
            expect(breastfeeding).toBeVisible();
          }
          if (innerText == "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();
          }
        }
      }
    });

    await test.step("Selecting Has the child been defiled as no", async () => {
      if (patient.person.age < 10) {
        const elementvalue = await page.locator(
          "input[name=childDefiledMotherid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
      if(patient.person.age < 15 && patient.person.age >=10){
        const elementvalue = await page.locator(
          "input[name=childDefiledid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });

    await test.step("Selecting client ever had sex and validation the questions", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=sexuallyActiveid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect(["1", "0"]).toContain(innerText);

          if (innerText == "1") {
            await element.click();
            await expect(
              page.locator("input[name=activeSexuallyid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=newPartnerid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=partnerHivStatusid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=multipleSexPartnersid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=alcoholicSexid]").first()
            ).toBeVisible();

            await expect(
              page.locator("input[name=moneySexid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=condomBurstid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=strangerSexid]").first()
            ).toBeVisible();

            await expect(
              page.locator("input[name=knownPositiveid]").first()
            ).toBeVisible();
          }
        }
      }
    });

    await test.step("Validating the sexually active concepts and selecting yes", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=activeSexuallyid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          await expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });

    await test.step("Validating new sexual partner concept and selecting yes", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=newPartnerid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          await expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });

    await test.step("validating partnerhiv status and selecting hiv negative", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator(
          "input[name=partnerHivStatusid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
            await expect(
              page.locator("input[name=coupleDiscordantid]").first()
            ).toBeVisible();
          }
        }
      }
    });
    await test.step("validating the couple discordant and selecting no", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator(
          "input[name=coupleDiscordantid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });
    await test.step("validating multiple partners unprotected sex and the number", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator(
          "input[name=multipleSexPartnersid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect(["1", "0"]).toContain(innerText);
          if (innerText == "1") {
            await element.click();
            await expect(page.locator("#noSexPartnersid")).toBeVisible();
            page.locator("#noSexPartnersid").fill("2");
          }
        }
      }
    });
    await test.step("validating engage sex under influence of drugs and selecting sometimes", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=alcoholicSexid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "0d2f24cd-0bd9-4159-b71d-a92f2c11a396",
            "1385AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1385AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });
    await test.step("Validating Unprotected sex under in exchange of money concepts and selecting yes", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=moneySexid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });

    await test.step("validating condom burst options and selecting yes", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=condomBurstid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });
    await test.step("validating unprotected sex with someone you do not the HIV status reply options and selecting yes", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=strangerSexid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });

    await test.step("validating unprotected sex with someone known HIVStatus reply options and selecting yes", async () => {
      if (patient.person.age >= 15) {
        const elementvalue = await page.locator("input[name=knownPositiveid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
          }
        }
      }
    });

    await test.step("validating the traditional scarification and selecting yes", async () => {
      if (patient.person.age <= 10) {
        const selectedelement = await page
        .locator("#motHersHivstatusid_0")
        .isChecked();
        if (selectedelement !== true) {
          const elementvalue = await page.locator(
            "input[name=traditionalMethdsid]"
          );
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect([
              "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ]).toContain(innerText);

            if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
              //await element.click();
              await page.evaluate("document.getElementById('traditionalMethdsMotherid_1').click()");
            }
          }
        }
      }
      else {
        const elementvalue = await page.locator(
          "input[name=traditionalMethdsid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await page.evaluate("document.getElementById('traditionalMethdsid_1').click()");
          }
        }
      }
    });

    await test.step("Validating the GBV questions and selecting yes", async () => {
      if (patient.person.age >= 9) {
        const elementvalue = await page.locator("input[name=experiencedGbvid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();

            expect(
              page.locator("input[name=sexualViolenceid]").first()
            ).toBeVisible();
            expect(
              page.locator("input[name=forcedSexid]").first()
            ).toBeVisible();
          }
        }
      }
    });

    await test.step("Validating the sexual violence question and selecting yes", async () => {
      if (patient.person.age >= 9) {
        const elementvalue = await page.locator("input[name=sexualViolenceid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();
          }
        }
      }
    });

    await test.step("Validating the forced sex question and selecting yes", async () => {
      if (patient.person.age >= 9) {
        const elementvalue = await page.locator("input[name=forcedSexid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();
          }
        }
      }
    });

    await test.step("Checking the PREP service and assertng currently on prep question is present", async () => {
      if (patient.person.age >= 15) {
        await page.evaluate(
          "document.getElementById('0prepServiceid').click()"
        );
        await expect(
          page.locator("input[name=currentlyPrepid]").first()
        ).toBeVisible();
      }
    });

    await test.step("Validating currently on  prep options and selecting yes", async () => {
      if (patient.person.age >= 15) {
            const elementvalue = await page.locator(
              "input[name=currentlyPrepid]"
            );
            const elementcount = await elementvalue.count();
            for (var index = 0; index < elementcount; index++) {
              const element = await elementvalue.nth(index);
              const innerText = await element.getAttribute("value");
              expect([
                "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              ]).toContain(innerText);
              if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
                element.click();
              }
            }
          
          /*expect([
       "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
       "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
       "1067AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
     ]).toContain(innerText);*/
        
    }
      
    });

    await test.step("Checking the PEP service and assertng client used PEP question is present", async () => {
      if (patient.person.age >= 9 && patient.person.age < 10) {
        const elementvalueMotherHIV = await page.locator(
          "input[name=motHersHivstatusid]"
        );
        const elementcount = await elementvalueMotherHIV.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalueMotherHIV.nth(index);
          const innerText = await element.getAttribute("value");
          const selectedValueElement = await element.isChecked();
          if (
            selectedValueElement == true &&
            innerText !== "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          ) {
            await page.evaluate(
              "document.getElementById('0pepServiceid').click()"
            );
            await expect(
              page.locator("input[name=currentlyPepid]").first()
            ).toBeVisible();
          }
        }
      }
    });

    await test.step("Validating currently on  prep options and selecting yes", async () => {
      if (patient.person.age >= 9 && patient.person.age < 10) {
        const elementvalueMotherHIV = await page.locator(
          "input[name=motHersHivstatusid]"
        );
        const elementcount = await elementvalueMotherHIV.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalueMotherHIV.nth(index);
          const innerText = await element.getAttribute("value");
          const selectedValueElement = await element.isChecked();
          if (
            selectedValueElement == true &&
            innerText !== "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          ) {
            const elementvalue = await page.locator(
              "input[name=currentlyPepid]"
            );
            const elementcount = await elementvalue.count();
            for (var index = 0; index < elementcount; index++) {
              const element = await elementvalue.nth(index);
              const innerText = await element.getAttribute("value");

              expect([
                "1",
                "0",
                "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              ]).toContain(innerText);
              if (innerText == "1") {
                element.click();
              }
            }
          }
        }
      }
    });

    await test.step("Checking the STI service and asserting if the client had STI question is present", async () => {
      if (patient.person.age >= 9 && patient.person.age < 10) {
        const elementvalueMotherHIV = await page.locator(
          "input[name=motHersHivstatusid]"
        );
        const elementcount = await elementvalueMotherHIV.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalueMotherHIV.nth(index);
          const innerText = await element.getAttribute("value");
          const selectedValueElement = await element.isChecked();
          if (
            selectedValueElement == true &&
            innerText !== "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          ) {
            await page.evaluate(
              "document.getElementById('0stiServiceid').click()"
            );

            await expect(
              page.locator("input[name=currentlyStiid]").first()
            ).toBeVisible();
          }
        }
      }
    });

    await test.step("Validating client had STI options and selecting yes", async () => {
      if (patient.person.age >= 9 && patient.person.age < 10) {
        const elementvalueMotherHIV = await page.locator(
          "input[name=motHersHivstatusid]"
        );
        const elementcount = await elementvalueMotherHIV.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalueMotherHIV.nth(index);
          const innerText = await element.getAttribute("value");
          const selectedValueElement = await element.isChecked();
          if (
            selectedValueElement == true &&
            innerText !== "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          ) {
            const elementvalue = await page.locator(
              "input[name=currentlyStiid]"
            );
            const elementcount = await elementvalue.count();
            for (var index = 0; index < elementcount; index++) {
              const element = await elementvalue.nth(index);
              const innerText = await element.getAttribute("value");

              expect([
                "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              ]).toContain(innerText);
              if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
                element.click();
              }
            }
          }
        }
      }
    });

    await test.step("Validating the screened for TB questions and selecting yes", async () => {
      if (patient.person.age <= 10) {
        const selectedelement = await page
          .locator("#motHersHivstatusid_0")
          .isChecked();
        if (selectedelement !== true) {
          const elementvalue = await page.locator("input[name=screenedTBid]");
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect([
              "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ]).toContain(innerText);
            if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
              element.click();
              await expect(
                page.locator("input[name=coughDurationid]").first()
              ).toBeVisible();
              await expect(
                page.locator("input[name=feverid]").first()
              ).toBeVisible();
              await expect(
                page.locator("input[name=weightLossid]").first()
              ).toBeVisible();
              await expect(
                page.locator("input[name=experiencingSweatsid]").first()
              ).toBeVisible();
              await expect(
                page.locator("input[name=tbResultstaTuSid]").first()
              ).toBeVisible();
            }
          }
        }
      } else {
        const elementvalue = await page.locator("input[name=screenedTBid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);
          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            element.click();
            await expect(
              page.locator("input[name=coughDurationid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=feverid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=weightLossid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=experiencingSweatsid]").first()
            ).toBeVisible();
            await expect(
              page.locator("input[name=tbResultstaTuSid]").first()
            ).toBeVisible();
          }
        }
      }
    });

    await test.step("Selecting yes for the cough question", async () => {
      if (patient.person.age <= 10) {
        const selectedelement = await page
          .locator("#motHersHivstatusid_0")
          .isChecked();
        if (selectedelement !== true) {
          const elementvalue = await page.locator(
            "input[name=coughDurationid]"
          );
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect([
              "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ]).toContain(innerText);

            if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
              await element.click();
            }
          }
        }
      } else {
        const elementvalue = await page.locator("input[name=coughDurationid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();
          }
        }
      }
    });

    await test.step("Selecting yes for the fever question", async () => {
      if (patient.person.age <= 10) {
        const selectedelement = await page
          .locator("#motHersHivstatusid_0")
          .isChecked();
        if (selectedelement !== true) {
          const elementvalue = await page.locator("input[name=feverid]");
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect([
              "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ]).toContain(innerText);

            if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
              await element.click();
            }
          }
        }
      } else {
        const elementvalue = await page.locator("input[name=feverid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await element.click();
          }
        }
      }
    });

    await test.step("Selecting yes for the noticeable weight question", async () => {
      if (patient.person.age <= 10) {
        const selectedelement = await page
          .locator("#motHersHivstatusid_0")
          .isChecked();
        if (selectedelement !== true) {
          const elementvalue = await page.locator("input[name=weightLossid]");
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect(["1", "0"]).toContain(innerText);

            if (innerText == "1") {
              await element.click();
            }
          }
        }
      } else {
        const elementvalue = await page.locator("input[name=weightLossid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect(["1", "0"]).toContain(innerText);

          if (innerText == "1") {
            await element.click();
          }
        }
      }
    });

    await test.step("Selecting yes for the night sweats question", async () => {
      if (patient.person.age <= 10) {
        const selectedelement = await page
          .locator("#motHersHivstatusid_0")
          .isChecked();
        if (selectedelement !== true) {
          const elementvalue = await page.locator(
            "input[name=experiencingSweatsid]"
          );
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect(["1", "0"]).toContain(innerText);

            if (innerText == "1") {
              await element.click();
            }
          }
        }
      } else {
        const elementvalue = await page.locator(
          "input[name=experiencingSweatsid]"
        );
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect(["1", "0"]).toContain(innerText);

          if (innerText == "1") {
            await element.click();
          }
        }
      }
    });

    await test.step("Validating the TBStatus options", async () => {
      if (patient.person.age <= 10) {
        const selectedelement = await page
          .locator("#motHersHivstatusid_0")
          .isChecked();
        if (selectedelement !== true) {
          const elementvalue = await page.locator(
            "input[name=tbResultstaTuSid]"
          );
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect([
              "1660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "142177AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "1662AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "160737AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ]).toContain(innerText);

            if (innerText == "142177AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
              await expect(element.isChecked()).toBeTruthy;
            }
          }
        }
      } else {
        const elementvalue = await page.locator("input[name=tbResultstaTuSid]");
        const elementcount = await elementvalue.count();
        for (var index = 0; index < elementcount; index++) {
          const element = await elementvalue.nth(index);
          const innerText = await element.getAttribute("value");

          expect([
            "1660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "142177AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "1662AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "160737AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          ]).toContain(innerText);

          if (innerText == "142177AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
            await expect(element.isChecked()).toBeTruthy;
          }
        }
      }
    });
    await test.step("Fill the currently pregnant question and validating the options", async () => {
      if (patient.person.gender == "F") {
        if (patient.person.age <= 10) {
          const selectedelement = await page
            .locator("#motHersHivstatusid_0")
            .isChecked();
          if (selectedelement !== true) {
            const elementvalue = await page.locator("input[name=preGnantid]");
            const elementcount = await elementvalue.count();
            for (var index = 0; index < elementcount; index++) {
              const element = await elementvalue.nth(index);
              const innerText = await element.getAttribute("value");

              expect([
                "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              ]).toContain(innerText);
              if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
                element.click();
              }
            }
          }
        } else {
          const elementvalue = await page.locator("input[name=preGnantid]");
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect([
              "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ]).toContain(innerText);
            if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
              element.click();
            }
          }
        }
      }
    });

    await test.step("Fill the breastfeeding question and validating the options", async () => {
      if (patient.person.gender == "F") {
        if (patient.person.age <= 10) {
          const selectedelement = await page
            .locator("#motHersHivstatusid_0")
            .isChecked();
          if (selectedelement !== true) {
            const elementvalue = await page.locator(
              "input[name=breastfeedingid]"
            );
            const elementcount = await elementvalue.count();
            for (var index = 0; index < elementcount; index++) {
              const element = await elementvalue.nth(index);
              const innerText = await element.getAttribute("value");

              expect([
                "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              ]).toContain(innerText);
              if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
                element.click();
              }
            }
          }
        } else {
          const elementvalue = await page.locator(
            "input[name=breastfeedingid]"
          );
          const elementcount = await elementvalue.count();
          for (var index = 0; index < elementcount; index++) {
            const element = await elementvalue.nth(index);
            const innerText = await element.getAttribute("value");

            expect([
              "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "162570AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            ]).toContain(innerText);
            if (innerText == "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
              element.click();
            }
          }
        }
      }
    });

    await test.step("Fill if client eligible for testing", async () => {
      const elementvalue = await page.locator("input[name=eligibleTestid]");
      const elementcount = await elementvalue.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await elementvalue.nth(index);
        const innerText = await element.getAttribute("value");

        expect([
          "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ]).toContain(innerText);

        if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
          await element.click();

          expect(
            page.locator("input[name=clientReferredid]").first()
          ).toBeVisible();
        }
      }
    });

    await test.step("Generate the risk Score", async () => {
      await page
        .getByRole("button", { name: /Get HIV risk category/i })
        .click();
    });
    await test.step("And I should not see any dialog to fix required fields", async () => {
      page.on("dialog", async (dialog) => {
        expect(dialog.message()).toBeUndefined;
        // await dialog.dismiss();
      });
    });
    await test.step("Selecting recommended HIV testing as yes ", async () => {
      const elementvalue = await page.locator("input[name=reCommeNHiVtestid]");
      const elementcount = await elementvalue.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await elementvalue.nth(index);
        const innerText = await element.getAttribute("value");

        expect([
          "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ]).toContain(innerText);

        if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
          await element.click();
          expect(page.locator("input[name=ReasonOnEid]").first()).toBeVisible();
        }
      }
    });
    await test.step("Fill why recommend testing and asserting the concepts", async () => {
      const elementvalue = await page.locator("input[name=ReasonOnEid]");
      const elementcount = await elementvalue.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await elementvalue.nth(index);
        const innerText = await element.getAttribute("value");

        expect([
          "ccf759b9-bdd4-4265-a71a-67a894d89dec",
          "d79488b7-eb63-49ba-b99c-a52f777a1a7f",
          "1163AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "163510AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ]).toContain(innerText);
        if (innerText == "1163AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
          element.click();
        }
      }
    });

    await test.step("Selecting yes for client referred testing ", async () => {
      const elementvalue = await page.locator("input[name=clientReferredid]");
      const elementcount = await elementvalue.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await elementvalue.nth(index);
        const innerText = await element.getAttribute("value");

        expect([
          "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ]).toContain(innerText);

        if (innerText == "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
          await element.click();
        }
      }
    });
    await test.step("And I click on the `Save` button", async () => {
      await page.getByRole("button", { name: /save/i }).click();
    });
    await test.step("Then I should see a success notification", async () => {
      await expect(
        page.getByText(/The form has been submitted successfully./i)
      ).toBeVisible();
    });

    await test.step("And I should not see any error messages", async () => {
      await expect(page.getByText("error")).not.toBeVisible();
    });

    await test.step("And if I navigate to the visits dashboard", async () => {
      await visitsPage.goTo(patient.uuid);
    });

    await test.step("Then I should see the newly filled form in the encounters table", async () => {
      await expect(
        page.getByRole("tab", { name: /visit summaries/i })
      ).toBeVisible();
      await expect(
        page.getByRole("tab", { name: /all encounters/i })
      ).toBeVisible();

      await page.getByRole("tab", { name: /^encounters$/i }).click();

      const headerRow = page.getByRole("table").locator("thead > tr");

      await expect(headerRow).toContainText(/date & time/i);
      await expect(headerRow).toContainText(/encounter type/i);
      await expect(headerRow).toContainText(/provider/i);

      await page.getByRole("table").locator("th#expand").click();

      await expect(page.getByText("HIV test date")).toBeVisible();
      await expect(page.getByText("Population type")).toBeVisible();
    });
  });
});
