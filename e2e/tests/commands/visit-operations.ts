import { type APIRequestContext, expect } from '@playwright/test';
import { type Visit } from '@openmrs/esm-framework';
import dayjs from 'dayjs';

export const startVisit = async (api: APIRequestContext, patientId: string): Promise<Visit> => {

    const data= {
      "patient":patientId,
      "startDatetime":dayjs().subtract(1, 'D').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
      "visitType": "3371a4d4-f66f-4454-a86d-92c7b3da990c",
      "location": process.env.E2E_LOGIN_DEFAULT_LOCATION_UUID?.toString(),
      "attributes": [
        
      ]
    }
  const visitRes = await api.post('visit', {
    data
  });

  await expect(visitRes.ok()).toBeTruthy();
  return await visitRes.json();
};

export const endVisit = async (api: APIRequestContext, uuid: string) => {
  const visitRes = await api.post(`visit/${uuid}`, {
    data: {
      location: process.env.E2E_LOGIN_DEFAULT_LOCATION_UUID,
      startDatetime: dayjs().subtract(1, 'D').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
      visitType: '7b0f5697-27e3-40c4-8bae-f4049abfb4ed',
      stopDatetime: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
    },
  });

  return await visitRes.json();
};
