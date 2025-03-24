# E2E Tests

This package contains end-to-end tests for the Orama UI components, implemented using Cypress.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your specific settings.

## Test Structure

- `cypress/e2e/` - Contains all test files organized by app
  - `demo-react/` - Tests for the React demo app
  - `demo-nextjs/` - Tests for the Next.js demo app (to be implemented)
  - `demo-vue/` - Tests for the Vue demo app (to be implemented)
- `cypress/fixtures/` - Test data and fixtures
- `cypress/support/` - Support files, custom commands, and utilities

## Running Tests

### Open Cypress Test Runner

```bash
pnpm cy:open
```

### Run Tests in Headless Mode

Run tests for a specific app:

```bash
# Test the React demo app
pnpm test:react

# Test the Next.js demo app
pnpm test:nextjs

# Test the Vue demo app
pnpm test:vue
```

Run all tests:

```bash
pnpm test:all
```

## Environment Variables

- `TEST_ENV`: Determines which app to test (react, nextjs, vue)
- `ORAMA_API_KEY`: API key for Orama Cloud
- `ORAMA_ENDPOINT`: Endpoint for Orama Cloud
- `CYPRESS_BROWSER`: Preferred browser for testing

## Adding New Tests

1. Create a new test file in the appropriate directory under `cypress/e2e/`
2. Use the existing tests as a template
3. Run the tests to verify they work as expected

## Best Practices

1. Use data attributes for test selectors when possible
2. Keep tests isolated and independent
3. Use fixtures for test data
4. Avoid hard-coding API keys and endpoints in test files
