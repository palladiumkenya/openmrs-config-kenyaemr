import { APIRequestContext, expect } from '@playwright/test';
import dayjs from 'dayjs';

export const generateOpeningStock = async (api: APIRequestContext, batchNo: string) => {
    // Generate OpenMRSID
    const stockResponse = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/stockmanagement/stockoperation`, {
        data: {
            "operationDate": dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "sourceUuid": "60365847-49e3-11ef-a2b9-c025a58a8b28",
            "responsiblePersonUuid": "cb7be2e4-e42b-474c-932e-2f91e652b64f",
            "responsiblePersonOther": "",
            "remarks": "",
            "operationTypeUuid": "99999999-9999-9999-9999-999999999999",
            "stockOperationItems": [
                {
                    "stockItemUuid": "6106ab46-6712-4da5-b776-f10cee03a06c",
                    "stockItemPackagingUOMUuid": "fcd6c060-cb70-453b-8c91-e24bf4ff8a8c",
                    "batchNo": batchNo,
                    "expiration": dayjs().add(2, 'year').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                    "quantity": 7752,
                    "purchasePrice": null,
                    "hasExpiration": true
                }
            ],
            "approvalRequired": false
        },
    });

    // await expect(stockResponse.ok()).toBeTruthy();
    const { uuid } = await stockResponse.json();

    // post data
    const batchResponse = await api.post(`${process.env.E2E_BASE_URL}/ws/rest/v1/stockmanagement/stockoperationaction`, {
        data: {
            "name": "COMPLETE",
            "uuid": uuid,
            "reason": ""
        }
    });

    // await expect(batchResponse.ok()).toBeTruthy();
    return await batchResponse.json();
};