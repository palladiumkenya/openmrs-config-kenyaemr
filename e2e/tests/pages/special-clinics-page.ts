import { Page } from '@playwright/test';

export class SpecialClinicPage {
  constructor(readonly page: Page) { }

  async gotoNeurologyPage(uuid: string) {
    await this.page.goto(`/openmrs/spa/patient/${uuid}/chart/special-clinics-dashboard?clinic=neurology-clinic`);
    await this.page.getByRole('button', { name: 'Specialized Clinics' }).click();
    await this.page.getByRole('link', { name: 'Neurology' }).click();
  }

  async gotoDiabetesPage(uuid: string) {
    await this.page.goto(`/openmrs/spa/patient/${uuid}/chart/special-clinics-dashboard?clinic=diabetic-clinic`);
    await this.page.getByRole('button', { name: 'Specialized Clinics' }).click();
    await this.page.getByRole('link', { name: 'Diabetic' }).click();
  }
}
