import { Page } from '@playwright/test';

export class VisitsPage {
  constructor(readonly page: Page) {}

  async gotoVisitsPage(uuid: string) {
    await this.page.goto(`/openmrs/spa/patient/${uuid}/chart/Visits`);
  }
}
