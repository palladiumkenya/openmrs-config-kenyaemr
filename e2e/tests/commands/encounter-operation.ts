import { APIRequestContext, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';


export const generateNegativePatient = async (api: APIRequestContext, patientId: string, visit: string) => {
    // post data
    const patientNegRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/encounter/`, {
        data: {
            "encounterProviders": [
                {
                    "provider": `${process.env.E2E_PROVIDER_UUID}`,
                    "encounterRole": "a0b03050-c99b-11e0-9572-0800200c9a66"
                }
            ],
            "location": `${process.env.E2E_FACILITY_UUID}`,
            "patient": patientId,
            "visit": visit,
            "encounterType": "9c0a7a57-62ff-4f75-babe-5835b0e921b7",
            "form": "402dc5d7-46da-42d4-b2be-f43ea4ad87b0",
            "obs": [
                {
                    "concept": "cf543666-ce76-4e91-8b8d-c0b54a436a2e",
                    "value": "5d308c8c-ad49-45e1-9885-e5d09a8e5587"
                },
                {
                    "concept": "162558AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "164401AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "159813AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 13
                },
                {
                    "concept": "2797e57b-d1ff-4928-b10e-b72e95b63faf",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "cabad9c8-87e1-4163-b5fc-64cab0ca578b",
                    "value": "1537AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "163556AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "164163AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "d85ff219-0f5a-408d-8df0-96bcc9be5071",
                    "value": "d650368d-0228-4493-b7c3-25bd1c74b462"
                },
                {
                    "concept": "160540AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "159940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "1659AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "1710AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "true"
                },
                {
                    "concept": "b61c1482-1697-404c-ab96-fd698d5fd317",
                    "value": "147082f4-0662-4bfa-a54c-914f1db97373"
                },
                {
                    "groupMembers": [
                        {
                            "concept": "214c83f9-435d-44f5-9ae6-d5757b7b4c7f",
                            "value": "7cf927f8-e734-474f-b71a-1459bb566aa2"
                        },
                        {
                            "concept": "3d4f9e8e-46cc-4024-a1c4-d0167f2c84a4",
                            "value": "KL200S12"
                        },
                        {
                            "concept": "162502AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "value": "2100-06-15 00:00:00"
                        },
                        {
                            "concept": "1040AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "value": "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                        }
                    ],
                    "voided": false,
                    "concept": "164410AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "159427AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "159427AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "164848AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "6096AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1175AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "c9404c8f-cf83-4bfe-acc0-4881599c78ba",
                    "value": "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "groupMembers": [
                        {
                            "concept": "1272AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "value": "166536AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                        }
                    ],
                    "voided": false,
                    "concept": "163180AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                }
            ],
            "orders": [
            ],
            "diagnoses": [
            ]
        }
    });

    await expect(patientNegRes.ok()).toBeTruthy();
    return await patientNegRes.json();
};


export const generateTriageEncounter = async (api: APIRequestContext, patientId: string, visit: string) => {
    // post data
    const encounterRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/encounter/`, {
        data: {
            "encounterProviders": [
                {
                    "provider": `${process.env.E2E_PROVIDER_UUID}`,
                    "encounterRole": "a0b03050-c99b-11e0-9572-0800200c9a66"
                }
            ],
            "location": `${process.env.E2E_FACILITY_UUID}`,
            "patient": patientId,
            "visit": visit,
            "encounterType": "d1059fb9-a079-4feb-a749-eedd709ae542",
            "form": "37f6bd8d-586a-4169-95fa-5781f987fe62",
            "obs": [
                {
                    "concept": "5219AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 67
                },
                {
                    "concept": "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 167
                },
                {
                    "concept": "1342AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 24
                },
                {
                    "concept": "167392AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1115AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                }
            ],
            "orders": [
            ],
            "diagnoses": [
            ]
        }
    });

    await expect(encounterRes.ok()).toBeTruthy();
    return await encounterRes.json();
};

export const generateHivEnrollmentEncounter = async (api: APIRequestContext, patientId: string, visit: string) => {
    // Generate random numbers and dates
    const patientUPN = faker.string.numeric(10);

    // post data
    const encounterRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/encounter/`, {
        data: {
            "encounterProviders": [
                {
                    "provider": `${process.env.E2E_PROVIDER_UUID}`,
                    "encounterRole": "a0b03050-c99b-11e0-9572-0800200c9a66"
                }
            ],
            "location": `${process.env.E2E_FACILITY_UUID}`,
            "patient": patientId,
            "visit": visit,
            "encounterType": "de78a6be-bfc5-4634-adc3-5f1a280455cc",
            "form": "e4b506c1-7379-42b6-a374-284469cba8da",
            "obs": [
                {
                    "concept": "423c034e-14ac-4243-ae75-80d1daddce55",
                    "value": "164144AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "160540AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "160539AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "160554AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "2025-02-24 00:00:00"
                }
            ],
            "orders": [
            ],
            "diagnoses": [
            ]
        }
    });

    // Generate UPN
    const patientUPNRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/patient/${patientId}/identifier`, {
        data: {
            "identifierType": "05ee9cf4-7242-4a17-b4d4-00f707265c8a",
            "identifier": patientUPN,
            "location": `${process.env.E2E_FACILITY_UUID}`,
            "preferred": false
        },
    });


    // Generate program
    const programRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/programenrollment`, {
        data: {
            "patient": patientId,
            "program": "dfdc6d40-2f2f-463d-ba90-cc97350441a8",
            "dateEnrolled": "2024-02-24T16:27:00+03:00",
            "dateCompleted": null,
            "location": `${process.env.E2E_FACILITY_UUID}`
        },
    });

    // console.log("encounter response: ", encounterRes);
    // console.log("identifier response: ",patientUPNRes);
    // console.log("program response: ",programRes);

    return await encounterRes.json();

};

export const generateMCHEnrollmentEncounter = async (api: APIRequestContext, patientId: string, visit: any) => {
    // Generate random numbers and dates
    const year = dayjs().year(); // or any year you want
    const month = String(dayjs().month() + 1).padStart(2, '0'); // month is 0-based
    const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    const randomValue = `${year}-${month}-${randomNum}`;

    // post data
    const encounterRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/encounter/`, {
        data: {
            "encounterProviders": [
                {
                    "provider": `${process.env.E2E_PROVIDER_UUID}`,
                    "encounterRole": "a0b03050-c99b-11e0-9572-0800200c9a66"
                }
            ],
            "location": `${process.env.E2E_FACILITY_UUID}`,
            "patient": patientId,
            "visit": visit.uuid,
            "encounterType": "3ee036d8-7c13-4393-b5d6-036f2fe45126",
            "form": "90a18f0c-17cd-4eec-8204-5af52e8d77cf",
            "obs": [
                {
                    "concept": "160478AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1623AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "163530AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": randomValue
                },
                {
                    "concept": "160080AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 1
                },
                {
                    "concept": "1823AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 0
                },
                {
                    "concept": "5624AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 2
                },
                {
                    "concept": "160598AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 9
                },
                {
                    "concept": "159427AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "164142AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "0179f241-8c1d-47c1-8128-841f6508e251",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                }
            ],
            "orders": [
            ],
            "diagnoses": [
            ]
        }
    });

    // Generate program
    const programRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/programenrollment`, {
        data: {
            "patient": patientId,
            "program": "b5d9e05f-f5ab-4612-98dd-adb75438ed34",
            "dateEnrolled": visit.startDatetime,
            "dateCompleted": null,
            "location": `${process.env.E2E_FACILITY_UUID}`
        },
    });

    // console.log("encounter response: ", encounterRes);
    // console.log("identifier response: ",patientUPNRes);
    // console.log("program response: ",programRes);

    return await encounterRes.json();

};