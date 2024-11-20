import { APIRequestContext, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const generateRandomPatient = async (api: APIRequestContext, gender: string, birthdate: string) => {
    // Generate random name
    const firstName = faker.person.firstName();
    const middleName = faker.person.middleName();
    const lastName = faker.person.lastName();

    // Generate uuid for patient
    const patientUUID = uuidv4();

    // Generate OpenMRSID
    const identifierRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/idgen/identifiersource/fb034aac-2353-4940-abe2-7bc94e7c1e71/identifier`, {
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
                    "location": "4d67d492-39dd-4fda-90a8-c5122abdb78b",
                    "preferred": false
                }
            ]
        }
    });

    await expect(patientRes.ok()).toBeTruthy();
    return await patientRes.json();
};