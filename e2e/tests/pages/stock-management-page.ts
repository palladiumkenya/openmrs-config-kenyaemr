import { Page } from '@playwright/test';

export class StockManagementPage {
  constructor(readonly page: Page) { }

  async gotoOperations() {
    await this.page.goto(`/openmrs/spa/stock-management/operations`);
  } 

  async gotoItems() {
    await this.page.goto(`/openmrs/spa/stock-management/items`);
  }
}