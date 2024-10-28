import { Page } from '@playwright/test';

export function addURLChangeListener(page: Page) {
  page.on('framenavigated', async (frame) => {
    if (frame === page.mainFrame()) {
      const currentURL = frame.url();

      if (currentURL.includes('/login/location')) {
        const firstCheckbox = page.locator('label').filter({ hasText: 'Nyeri Provincial General' }).locator('span').first();
        await firstCheckbox.check({ force: true });
        await page.locator('button:has-text("Confirm")').click();
      }
    }
  });
}
