import { Page } from '@playwright/test';

export class CarePanelPage {
  constructor(readonly page: Page) {}

  async gotoCarePanel(uuid: string) {
    await this.page.goto(`/openmrs/spa/patient/${uuid}/chart/Care panel`);
  }
}
