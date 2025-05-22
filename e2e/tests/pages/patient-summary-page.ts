import { Page } from '@playwright/test';

export class SummaryPage {
  constructor(readonly page: Page) {}

  async gotoSummaryPage(uuid: string) {
    await this.page.goto(`/openmrs/spa/patient/${uuid}/chart/Patient Summary`);
  }
}
