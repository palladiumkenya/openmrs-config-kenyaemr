import {expect, Page} from '@playwright/test';
import exp from "node:constants";

export class HomePage {
  constructor(readonly page: Page) {}

  async gotoHome() {
    await this.page.goto('home');
  }
}
