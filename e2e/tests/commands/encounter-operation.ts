import { APIRequestContext, expect } from '@playwright/test';


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

