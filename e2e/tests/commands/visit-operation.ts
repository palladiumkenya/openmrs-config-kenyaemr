import { APIRequestContext, expect } from '@playwright/test';
import dayjs from 'dayjs';

export const startVisit = async (api: APIRequestContext, patientId: string) => {
    const visitRes = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/visit`, {
      data: {
        startDatetime: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        patient: patientId,
        location: `${process.env.E2E_FACILITY_UUID}`,
        visitType: '3371a4d4-f66f-4454-a86d-92c7b3da990c',
        attributes: [],
      },
    });
  
    await expect(visitRes.ok()).toBeTruthy();
    return await visitRes.json();
};
