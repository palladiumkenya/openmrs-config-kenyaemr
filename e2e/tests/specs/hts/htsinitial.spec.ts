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

let patient: Patient;
let visit: Visit;



test.beforeEach(async ({ api }) => {
  //let patienttypes = await getPatientIdentifiers(api);

  /*let uuid = patienttypes?.results.find(
    (x) => x.display === "OpenMRS ID"
  )?.uuid;*/
  patient = await generateRandomPatient(api,"F",'1977-11-01');
  
  visit = await startVisit(api, patient.uuid);
});
test("Fill HTS Initial Form", async ({ page }) => {
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
  
    await test.step("When I click the `HTS Initial Form` link to launch the form", async () => {
      await page.getByText(/HTS Initial Form/i).click();
    });
  
    await test.step("Then I should see the `HTS Initial Form` form launch in the workspace", async () => {
      await expect(page.getByText(/HTS Initial Form/i)).toBeVisible();
    });
    await test.step("Selecting the HTS recording section",async()=>{
        await page.getByText(/HTS Recordings/i).first().click();
    })
    await test.step("should select an population type option from the select dropdown and assert the value", async () => {

      if(patient.person.age > 15){
  
        await page.locator('#populationTypeid').selectOption({value:'bf850dd4-309b-4cbd-9470-9d8110ea5550'});
        const selectedValue = await page.$eval('#populationTypeid', e => e.value);
        expect(selectedValue).toContain('bf850dd4-309b-4cbd-9470-9d8110ea5550');
         
       const optionlist=page.locator('#populationTypeid');
      
       const options = await page.$$eval('#populationTypeid > option', (els) => {
        return els.map(option => option.getAttribute("value"))
      })
      //console.log(options);
        await expect(options).toEqual(expect.arrayContaining(['5d308c8c-ad49-45e1-9885-e5d09a8e5587','bf850dd4-309b-4cbd-9470-9d8110ea5550']));
    }
    else {

      await page.evaluate("document.getElementById('populationTypechildid_0').click()");
    }
       
      
  });
  await test.step("Selecting the key and vulnerable population type and asserting the options",async()=>{
    if(patient.person.age > 15){
      if(patient.person.gender== 'F'){
    await page.locator('#kpTypeFemaleid').selectOption({value:'105AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
    const selectedValue = await page.$eval('#kpTypeFemaleid', e => e.value);
    expect(selectedValue).toContain('105AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
     
   const optionlist=page.locator('#kpTypeFemaleid');
  
   const options = await page.$$eval('#kpTypeFemaleid > option', (els) => {
    return els.map(option => option.getAttribute("value"))
  })
  //console.log(options);
    await expect(options).toEqual(expect.arrayContaining(['105AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','160666AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','160579AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    '160549AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','162277AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','159674AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','162198AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','6096AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  ]));
}

 if(patient.person.gender== 'M') {
  await page.locator('#kpTypeMaleid').selectOption({value:'105AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
    
    const selectedValue = await page.$eval(
      "#kpTypeMaleid",
      (e) => e.value
    );
    expect(selectedValue).toContain('105AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
     
   const optionlist=page.locator('#kpTypeMaleid');
  
   const options = await page.$$eval('#kpTypeMaleid > option', (els) => {
    return els.map(option => option.getAttribute("value"))
  })
  //console.log(options);
    await expect(options).toEqual(expect.arrayContaining(['105AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','160666AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','973e5b6c-ae5e-4d6a-a624-2d259763771f',
    '160578AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','162277AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','159674AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','162198AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','6096AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
  ]));
 }
}
  })

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
    
    const elementsvalue = [];
    const disability0 = await page
    .locator("//input[@id='0disaBilityTypesid']")
    .getAttribute("value");
    elementsvalue.push(disability0);
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
    const locator = await page.getByText("Visual impairment");
    locator.check();

    await expect(elementsvalue).toEqual(
      expect.arrayContaining([
        "120291AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "147215AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "151342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "164538AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      ])
    );
    await expect(locator).toBeChecked();
  });

  await test.step("Selecting the tested HIV By Provider", async () => {
    const elementvalue = await page.locator("input[name=everTestedid]");
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
        await expect(page.locator("//input[@id='durationSinceLastTestid']")).toBeVisible();
       
      }
    }
  });
  await test.step("Fill the duration in months sice last test",async()=>{
    await page.locator("#durationSinceLastTestid").fill("2");
  })
  await test.step("Fill client has done selftest and select yes",async()=>{
    const elementvalue = await page.locator("input[name=selfTestLastTwelveMonthsid]");
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
        await expect(
          page.locator("input[name=willingToShareResultsid]").first()
        ).toBeVisible();
       
      }
    }
  })
  await test.step('Answering yes for willing sharing results', async()=>{

    const elementvalue = await page.locator("input[name=willingToShareResultsid]");
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
        await expect(
          page.locator("input[name=selfTestResultsid]").first()
        ).toBeVisible();
        
        await 
       expect(page.locator('#DeteOfSelfTestid')).toBeVisible();
    }
  }
  })

  await test.step("Fill self test results",async()=>{

    const elementvalue = await page.locator("input[name=selfTestResultsid]");
    const elementcount = await elementvalue.count();
    for (var index = 0; index < elementcount; index++) {
      const element = await elementvalue.nth(index);
      const innerText = await element.getAttribute("value");

      expect([
        "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      ]).toContain(innerText);

      if (innerText == "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
        await element.click();
        await page.locator('#DeteOfSelfTestid').fill('11/11/2024');
    }
  }


  })



await test.step("Selecting the  HTS setting and asserting values",async()=>{
  const elementvalue = await page.locator("input[name=htsSettingid]");
  const elementcount = await elementvalue.count();
  for (var index = 0; index < elementcount; index++) {
    const element = await elementvalue.nth(index);
    const innerText = await element.getAttribute("value");

    expect([
      "1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "163488AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    ]).toContain(innerText);

    if (innerText == "1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
      await element.click();
      const locator = page.locator("#htsFacilityEntryPointid").locator("option");

      /* const options = await page.$$eval('#populationTypeid > option', (els) => {
      return els.map(option => option.getAttribute('value'));
    })*/
      let optionsfacilityentrypoint: any[] = [];

      const elementcount = await locator.count();
      for (var index = 0; index < elementcount; index++) {
        const element = await locator.nth(index);
        const innerText = await element.getAttribute("value");
        optionsfacilityentrypoint.push(innerText);
      }

      if (optionsfacilityentrypoint.length > 0) {
        await expect(optionsfacilityentrypoint).toEqual(
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
      }
     
    }

    


}

})

await test.step("Selecting the HTS Approach and asserting the concepts",async()=>{
  await page.locator('#htsApproachid').selectOption({value:'06f16792-9611-40d4-82ec-9615930cc486'});
    const selectedValue = await page.$eval('#htsApproachid', e => e.value);
    expect(selectedValue).toContain('06f16792-9611-40d4-82ec-9615930cc486');
     
  
  
   const options = await page.$$eval('#htsApproachid > option', (els) => {
    return els.map(option => option.getAttribute("value"))
  })
  //console.log(options);
    await expect(options).toEqual(expect.arrayContaining(['164163AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA','06f16792-9611-40d4-82ec-9615930cc486'
  ]));

})

await test.step("Selecting the HTS strategy and asserting the concepts",async()=>{
  await page.locator('#facilityStrategyid').selectOption({value:'d650368d-0228-4493-b7c3-25bd1c74b462'});
    const selectedValue = await page.$eval('#facilityStrategyid', e => e.value);
    expect(selectedValue).toContain('d650368d-0228-4493-b7c3-25bd1c74b462');
     

  const options = await page.$$eval(
    "#facilityStrategyid > option",
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
      "163108AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    ])
  );
})


await test.step("Selecting HTS Entry point and asserting the concepts",async()=>{
  await page.locator('#htsFacilityEntryPointid').selectOption({value:'159940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
    const selectedValue = await page.$eval('#htsFacilityEntryPointid', e => e.value);
    expect(selectedValue).toContain('159940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
     
 //await page.evaluate('document.getElementById("htsCommunityEntryPointid").options[2].selected=true');
  
})

await test.step("Selecting TBScreening question and  asserting the concepts",async()=>{

  const elementvalue = await page.locator("input[name=tbScreeningResultsid]");
  const elementcount = await elementvalue.count();
  for (var index = 0; index < elementcount; index++) {
    const element = await elementvalue.nth(index);
    const innerText = await element.getAttribute("value");

    expect([
      "1660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "142177AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "160737AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "1111AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    ]).toContain(innerText);

    if(innerText =="1660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" ){
      element.click();
    }
  }

})

await test.step("Selecting yes as consent given and asserting the concepts",async()=>{
  const elementvalue = await page.locator("input[name=consentGivenid]");
  const elementcount = await elementvalue.count();
  for (var index = 0; index < elementcount; index++) {
    const element = await elementvalue.nth(index);
    const innerText = await element.getAttribute("value");

    expect([
      "true",
      "false",
      
    ]).toContain(innerText);

    if(innerText =="true" ){
      element.click();
      expect(page.locator("input[name=testedAsid]").first()).toBeVisible();
    }
  }
})

await test.step("Selecting client tested as and asserting the concepts",async()=>{
  const elementvalue = await page.locator("input[name=testedAsid]");
  const elementcount = await elementvalue.count();
  for (var index = 0; index < elementcount; index++) {
    const element = await elementvalue.nth(index);
    const innerText = await element.getAttribute("value");

    expect([
      "147082f4-0662-4bfa-a54c-914f1db97373",
      "c3eba392-6f4d-4990-809f-91000503afbc",
      
    ]).toContain(innerText);

    if(innerText =="147082f4-0662-4bfa-a54c-914f1db97373" ){
      element.click();
      
    }
  }
})


await test.step("Selecting Kit 1 Name as trinscreen and asseting all the concepts",async()=>{

  await page.locator('#kitNameAid').selectOption({value:'9c4011c2-2579-49cf-ab53-93d009f03e7b'});
  const selectedValue = await page.$eval('#kitNameAid', e => e.value);
  expect(selectedValue).toContain('9c4011c2-2579-49cf-ab53-93d009f03e7b');
   

const options = await page.$$eval(
  "#kitNameAid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "9c4011c2-2579-49cf-ab53-93d009f03e7b",
    "7cf927f8-e734-474f-b71a-1459bb566aa2",
    "2f5a80fa-6f26-4832-b8a8-f47649bb60de",
    
  ])
);
  
})


await test.step("Fill lot number of the test kit",async()=>{
 const element=await page.locator('#lotNumberid');
    await  element.fill('0009999');

});

await test.step("Fill the expiry date of the test kit",async()=>{
  const element=await page.locator('#expiryDateid');
 await element.fill('11/12/2026');
})

await test.step("Filling the HIV Test 1Results as Positive and  asseting the concepts",async()=>{


  await page.locator('#testResultsid').selectOption({value:'703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
  const selectedValue = await page.$eval('#testResultsid', e => e.value);
  expect(selectedValue).toContain('703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
   

const options = await page.$$eval(
  "#testResultsid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "163611AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    
  ])
);

})

await test.step("Selecting Kit 2  Name and asserting the concepts",async()=>{
  await page.locator('#kitNameBid').selectOption({value:'3de9db8a-32a2-4518-8887-c8f25208dade'});
  const selectedValue = await page.$eval('#kitNameBid', e => e.value);
  expect(selectedValue).toContain('3de9db8a-32a2-4518-8887-c8f25208dade');
   

const options = await page.$$eval(
  "#kitNameBid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "3de9db8a-32a2-4518-8887-c8f25208dade",
    "59ef8c87-eb66-4f9e-a459-7227c01f682e"
  ])
);
})


await test.step("Filling the  lot number and  expiry date",async()=>{
  const lotelement=await page.locator('#lotNumberBid');
  await lotelement.fill('0009779');
  const expiryelement=await page.locator('#expiryDateBid');
  await expiryelement.fill('11/11/2026');
})

await test.step("Fill the  HIV Test 2 Results as  positive",async()=>{
  await page.locator('#testResultsBid').selectOption({value:'703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
  const selectedValue = await page.$eval('#testResultsBid', e => e.value);
  expect(selectedValue).toContain('703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
   

const options = await page.$$eval(
  "#testResultsBid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "163611AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    
  ])
);
})


await test.step("Fill kit 3 Name and asserting the concepts",async()=>{
  await page.locator('#kitNameCid').selectOption({value:'59ef8c87-eb66-4f9e-a459-7227c01f682e'});
  const selectedValue = await page.$eval('#kitNameCid', e => e.value);
  expect(selectedValue).toContain('59ef8c87-eb66-4f9e-a459-7227c01f682e');
   

const options = await page.$$eval(
  "#kitNameCid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "59ef8c87-eb66-4f9e-a459-7227c01f682e",
    
  ])
);
})

await test.step("Fill the lot number and expiry date",async()=>{
  const lotelement=await page.locator('#lotNumberCid');
  await  lotelement.fill('0009779');
  const expiryelement=await page.locator('#expiryDateCid');
  await expiryelement.fill('11/11/2026');
})


await test.step("Fill the HIV Test 3 Results ",async()=>{
  await page.locator('#testResultsCid').selectOption({value:'703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
  const selectedValue = await page.$eval('#testResultsCid', e => e.value);
  expect(selectedValue).toContain('703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
   

const options = await page.$$eval(
  "#testResultsCid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "163611AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    
  ])
);
})

await test.step("Fill the  final  HIV Results",async()=>{
  await page.locator('#hivFinalResultid').selectOption({value:'703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
  const selectedValue = await page.$eval('#hivFinalResultid', e => e.value);
  expect(selectedValue).toContain('703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
   

const options = await page.$$eval(
  "#hivFinalResultid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "703AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "1138AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    
  ])
);
})

await test.step("Clarifying if the final results were given and  asserting the  concepts",async()=>{
  await page.locator('#resultsGivenid').selectOption({value:'1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
  const selectedValue = await page.$eval('#resultsGivenid', e => e.value);
  expect(selectedValue).toContain('1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
   

const options = await page.$$eval(
  "#resultsGivenid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    
    
  ])
);
})

await test.step('Selecting couple discordant as  N/A and validating the concepts',async()=>{

  const elementvalue = await page.locator("input[name=coupleDiscordantid]");
    const elementcount = await elementvalue.count();
    for (var index = 0; index < elementcount; index++) {
      const element = await elementvalue.nth(index);
      const innerText = await element.getAttribute("value");

      expect([
        "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        "1175AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
      ]).toContain(innerText);

      if (innerText == "1175AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") {
        await element.click();
        
       
      }
    }

})

await test.step("Selecting yes as referred to the other service and  validating the concepts",async()=>{
  const elementvalue = await page.locator("input[name=ClieNtReferrEdid]");
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
        
         await expect(page.locator('#ReferredForCareid_0')).toBeVisible();
       
      }
    }
})

await test.step("Select to be referred to this facility and for confirmatory test",async()=>{
  await page.locator("#ReferredForCareid_0").click();
  
})
await test.step("Select referral to this facility ",async()=>{
  await page.locator('#ReferredToCareid').selectOption({value:'163266AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'});
  const selectedValue = await page.$eval('#ReferredToCareid', e => e.value);
  expect(selectedValue).toContain('163266AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
   

const options = await page.$$eval(
  "#ReferredToCareid > option",
  (els) => {
    return els.map((option) => option.getAttribute("value"));
  }
);
//console.log(options);
await expect(options).toEqual(
  expect.arrayContaining([
    '163266AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    '164407AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    
    
  ])
);
})

await test.step("Select No for recency done",async()=>{
  const elementvalue = await page.locator("input[name=recencyScreeningid]");
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
})
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

