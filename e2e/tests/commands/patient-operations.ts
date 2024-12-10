import { type APIRequestContext, expect } from '@playwright/test';
import { error } from 'console';
import {faker} from "@faker-js/faker";

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

export const generateRandomPatient = async (api: APIRequestContext,uuid:string,gender:string,birthdate:string): Promise<Patient> => {



  console.log('uuid', uuid);
  const identifierRes = await api.post(`idgen/identifiersource/fb034aac-2353-4940-abe2-7bc94e7c1e71/identifier`, {
    data: {},
  });
  
  
  const { identifier } = await identifierRes.json();
   console.log('identifier',identifier);


  await expect(identifierRes.ok()).toBeTruthy();
  const givenName=faker.person.firstName().toString();
  const familyName=faker.person.lastName().toString();
  
  /*const data={
    "identifiers": [
        {
            "identifier": identifier,
            "identifierType":uuid.toString(),
            "location": process.env.E2E_LOGIN_DEFAULT_LOCATION_UUID?.toString(),
            "preferred": false
        }
    ],
    "person": {
        "gender": gender,
        "birthdate": birthdate,
        "birthdateEstimated": true,
        "dead": false,
        "deathDate": null,
        "causeOfDeath": null,
        "names": [
            {
                "givenName": givenName,
                "familyName": familyName
            }
        ],
        "addresses": [
            {
                "address1": "Bom Jesus Street",
                "cityVillage": "Recide",
                "country": "Brazil",
                "postalCode": "560037"
            }
        ]
    }
}
  
  



  const patientRes = await api.post('patient', {data}).catch(error=>{
    console.log(error.message);
  });
 */

  const patientRes = await api.post('patient', {
    // TODO: This is not configurable right now. It probably should be.
    data: {
      identifiers: [
        {
          identifier,
          identifierType: uuid.toString(),
          location: process.env.E2E_LOGIN_DEFAULT_LOCATION_UUID?.toString(),
          preferred: true,
        },
      ],
      person: {
        addresses: [
          {
            address1: 'Bom Jesus Street',
            address2: '',
            cityVillage: 'Recife',
            country: 'Brazil',
            postalCode: '50030-310',
            stateProvince: 'Pernambuco',
          },
        ],
        attributes: [],
        birthdate: birthdate,
        birthdateEstimated: true,
        dead: false,
        gender: gender,
        names: [
          {
            familyName: familyName.toString(),
            givenName: givenName.toString(),
            middleName: '',
            preferred: true,
          },
        ],
      },
    },
  });
  

  await expect(patientRes.ok()).toBeTruthy();
  return await patientRes.json();
  
};

export const getPatient = async (api: APIRequestContext, uuid: string): Promise<Patient> => {
  const patientRes = await api.get(`patient/${uuid}?v=full`);
  return await patientRes.json();
};

export const deletePatient = async (api: APIRequestContext, uuid: string) => {
  await api.delete(`patient/${uuid}`, { data: {} });
};
