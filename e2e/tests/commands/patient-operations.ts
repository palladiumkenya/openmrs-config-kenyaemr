import { type APIRequestContext, expect } from '@playwright/test';
import { error } from 'console';
import {faker} from "@faker-js/faker";
import { v4 as uuidv4 } from 'uuid';

export interface Patient {
  uuid: string;
  identifiers: Identifier[];
  display: string;
  person: {
    uuid: string;
    display: string;
    gender: string;
    age: number;
    birthdate: string;
    birthdateEstimated: boolean;
    dead: boolean;
    deathDate?: string;
    causeOfDeath?: string;
    preferredAddress: {
      address1: string;
      cityVillage: string;
      country: string;
      postalCode: string;
      stateProvince: string;
      countyDistrict: string;
    };
    attributes: Array<Record<string, unknown>>;
    voided: boolean;
    birthtime?: string;
    deathdateEstimated: boolean;
    resourceVersion: string;
  };
  attributes: { value: string; attributeType: { uuid: string; display: string } }[];
  voided: boolean;
}

export interface Address {
  preferred: boolean;
  address1: string;
  cityVillage: string;
  country: string;
  postalCode: string;
  stateProvince: string;
}

export interface Identifier {
  uuid: string;
  display: string;
}
export interface patientIdentifiertype{
    display: string;
    uuid: string;
    name: string,
    format: string,
    required: boolean
}

export const getPatientIdentifiers= async(api:APIRequestContext):Promise<Array<patientIdentifiertype>>=>{
  const  patientIdentifiers=await api.get(`patientidentifiertype?v=custom:(display,uuid,name,format,required)`);
    
   return await patientIdentifiers.json();

    
    //return patientIdentifiers.json();
     
}

export const generateRandomPatient = async (api: APIRequestContext, gender: string, birthdate: string) => {
  // Generate random name
  const firstName = faker.person.firstName();
  const middleName = faker.person.middleName();
  const lastName = faker.person.lastName();

  // Generate uuid for patient
  const patientUUID = uuidv4();

  // Generate OpenMRSID
  const identifierRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/idgen/identifiersource/${process.env.E2E_PATIENT_IDENTIFIER}/identifier`, {
      data: {},
  });
  
  await expect(identifierRes.ok()).toBeTruthy();
  const { identifier } = await identifierRes.json();
  
  // post data
  const patientRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/patient/`, {
      data: {
          "uuid": patientUUID,
          "person": {
              "uuid": patientUUID,
              "names": [
                  {
                      "preferred": true,
                      "givenName": firstName,
                      "middleName": middleName,
                      "familyName": lastName
                  }
              ],
              "gender": gender,
              "birthdate": birthdate,
              "birthdateEstimated": true,
              "attributes": [
                  {
                      "attributeType": "b2c38640-2603-4629-aebd-3b54f33f1e3a",
                      "value": "0723933333"
                  },
                  {
                      "attributeType": "27573398-4651-4ce5-89d8-abec5998165c",
                      "value": "Bamburi Dispensary"
                  }
              ],
              "addresses": [
                  {
                      "countyDistrict": "Mombasa",
                      "stateProvince": "Kisauni",
                      "address4": "Bamburi",
                      "address6": "Bamburi",
                      "address5": "Bamburi",
                      "cityVillage": "Kiembeni",
                      "address2": "Mint"
                  }
              ],
              "dead": false
          },
          "identifiers": [
              {
                  "identifier": identifier,
                  "identifierType": "dfacd928-0370-4315-99d7-6ec1c9f7ae76",
                  "location": `${process.env.E2E_FACILITY_UUID}`,
                  "preferred": false
              }
          ]
      }
  });

  await expect(patientRes.ok()).toBeTruthy();
  return await patientRes.json();
};


export const deletePatient = async (api: APIRequestContext, uuid: string) => {
  await api.delete(`patient/${uuid}`, { data: {} });
};
