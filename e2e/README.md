# Kenyaemr E2E Testing Setup

This project contains end-to-end (e2e) tests using Playwright with TypeScript. It's structured to provide a scalable and maintainable testing framework.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Structure](#project-structure)
4. [Writing Tests](#writing-tests)
5. [Running Tests](#running-tests)
6. [Configuration](#configuration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm (usually comes with Node.js)

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Playwright browsers:
   ```
   npx playwright install
   ```
4. Copy env.example by 
    ``` sh
   cat env.example > .env
   ```
## Project Structure

The project is structured as follows:

```
e2e/
├── tests/
│   ├── core/
│   │   └── *.ts
│   ├── fixtures/
│   │   └── *.ts
│   ├── pages/
│   │   └── *.ts
│   └── specs/
│       └── *.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

- `core/`: Contains base test setups and utilities.
- `fixtures/`: Holds reusable test fixtures.
- `pages/`: Contains Page Object Models.
- `specs/`: Houses the actual test specifications.

## Writing Tests

1. Create a new page object in `tests/pages/` if needed.
2. Write your test in a new or existing spec file in `tests/specs/`.
3. Use the `test` function from `@playwright/test` to define your tests.

Example:

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';

test('Home page title is correct', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigate();
  expect(await homePage.getTitle()).toBe('Expected Title');
});
```

## Running Tests

To run all tests:

```
npm playwright test
```

To run a specific test file:

```
npx playwright test tests/specs/yourTestFile.ts
```

## Configuration

Playwright is configured in `playwright.config.ts`. You can modify this file to change settings such as browsers, viewport size, and more.

## Best Practices

1. Use Page Object Model for better maintainability.
2. Keep tests independent and isolated.
3. Use descriptive test and function names.
4. Utilize fixtures for reusable setup and teardown.
5. Keep sensitive data out of your tests (use environment variables).

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed correctly.
2. Check that Playwright browsers are installed.
3. Verify that your `playwright.config.ts` is correctly set up.
4. Look for error messages in the console output.

For more help, consult the [Playwright documentation](https://playwright.dev/docs/intro).