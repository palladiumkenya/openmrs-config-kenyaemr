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

export const generateVmmcEnrollmentEncounter = async (api: APIRequestContext, patientId: string, visit: any) => {
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
            "encounterType": "85019fbe-9339-49f7-8341-e9a04311bb99",
            "form": "a74e3e4a-9e2a-41fb-8e64-4ba8a71ff984",
            "obs": [
                {
                    "concept": "160482AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "165650AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "162728AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "164144AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "167094AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1555AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "167131AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "Homa Bay"
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
            "program": "228538f4-cad9-476b-84c3-ab0086150bcc",
            "dateEnrolled": "2025-05-28T15:28:10.000+0300",
            "dateCompleted": null,
            "location": `${process.env.E2E_FACILITY_UUID}`
        },
    });

    // console.log("encounter response: ", encounterRes);
    // console.log("identifier response: ",patientUPNRes);
    // console.log("program response: ",programRes);

    return await encounterRes.json();

};

export const generateVmmcMedicalEncounter = async (api: APIRequestContext, patientId: string, visit: string) => {
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
            "encounterType": "a2010bf5-2db0-4bf4-819f-8a3cffbcb21b",
            "form": "d42aeb3d-d5d2-4338-a154-f75ddac78b59",
            "obs": [
                {
                    "concept": "1710AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "true"
                },
                {
                    "concept": "159427AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "664AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "1154AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "false"
                },
                {
                    "concept": "166665AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "160557AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "false"
                },
                {
                    "concept": "164896AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "54AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "161536AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "1855AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "true"
                },
                {
                    "concept": "bfe0cbb2-eea0-4431-a5c5-d0f49a4ed21b",
                    "value": "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "1710AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "true"
                },
                {
                    "concept": "54AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "167118AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "167119AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "167119AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "167122AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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

export const generateVmmcProcedureEncounter = async (api: APIRequestContext, patientId: string, visit: string) => {
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
            "encounterType": "35c6fcc2-960b-11ec-b909-0242ac120002",
            "form": "5ee93f48-960b-11ec-b909-0242ac120002",
            "obs": [
                {
                    "concept": "167118AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "167119AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "167119AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "167121AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "164254AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "161914AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "162871AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "162736AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "159369AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1195AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "1473AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "b18c5e79-5112-4d76-94ba-09362cbca911"
                },
                {
                    "concept": "166014AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "162592AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "groupMembers": [
                        {
                            "concept": "164141AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "value": "b18c5e79-5112-4d76-94ba-09362cbca911"
                        },
                        {
                            "concept": "166014AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "value": "162592AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                        }
                    ],
                    "voided": false,
                    "concept": "164524AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "167133AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "255THS"
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

export const generateVmmcPostOperationEncounter = async (api: APIRequestContext, patientId: string, visit: string) => {
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD 00:00:00');

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
            "encounterType": "6632e66c-9ae5-11ec-b909-0242ac120002",
            "form": "620b3404-9ae5-11ec-b909-0242ac120002",
            "obs": [
                {
                    "concept": "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 120
                },
                {
                    "concept": "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 80
                },
                {
                    "concept": "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 72
                },
                {
                    "concept": "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": 36
                },
                {
                    "concept": "162871AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "166639AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "162736AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "160753AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": tomorrow
                },
                {
                    "concept": "5096AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": tomorrow
                },
                {
                    "concept": "1473AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "b18c5e79-5112-4d76-94ba-09362cbca911"
                },
                {
                    "concept": "1542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1577AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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

export const generateVmmcFollowupEncounter = async (api: APIRequestContext, patientId: string, visit: string) => {
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
            "encounterType": "2504e865-638e-4a63-bf08-7e8f03a376f3",
            "form": "08873f91-7161-4f90-931d-65b131f2b12b",
            "obs": [
                {
                    "concept": "164181AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1246AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "161011AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": false
                },
                {
                    "concept": "162871AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "groupMembers": [
                        {
                            "concept": "162875AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "value": "114403AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                        },
                        {
                            "concept": "162760AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "value": "1499AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                        }
                    ],
                    "voided": false,
                    "concept": "162747AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "162736AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                {
                    "concept": "1473AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "Nurse"
                },
                {
                    "concept": "1542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "value": "162592AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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