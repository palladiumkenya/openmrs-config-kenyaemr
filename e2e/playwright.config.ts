import { devices, PlaywrightTestConfig, defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

// See https://playwright.dev/docs/test-configuration.
const config: PlaywrightTestConfig = {
  testDir: 'tests',
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 40 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['junit', { outputFile: 'results.xml' }], ['html']] : [['html']],
  globalSetup: require.resolve('./tests/core/global-setup'),
  use: {
    baseURL: `${process.env.E2E_BASE_URL}/spa/`,
    storageState: 'storageState.json',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false, // Set to false to run the browser in headed mode (visible)
      },
    },
  ],
};

export default config;


