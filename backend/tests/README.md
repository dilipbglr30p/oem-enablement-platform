# Backend Testing Guide

This directory contains comprehensive tests for the Textile OEM Platform Backend API.

## Test Structure

```
tests/
├── unit/           # Unit tests for individual functions/classes
├── api/            # API integration tests using Supertest
├── e2e/            # End-to-end tests using Playwright
├── setup.ts        # Test setup and mocks
└── README.md       # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### API Tests Only
```bash
npm run test:api
```

### E2E Tests Only
```bash
npm run test:e2e
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Test Environment

Tests use a separate environment configuration (`.env.test`) and mock external services:

- **Database**: Supabase client is mocked
- **Redis**: Redis client is mocked
- **Sentry**: Sentry is mocked
- **External APIs**: Razorpay, Twilio are mocked

## Writing Tests

### Unit Tests
Test individual functions and classes in isolation:
```typescript
describe('Health Controller', () => {
  it('should return health status', async () => {
    // Test implementation
  });
});
```

### API Tests
Test API endpoints using Supertest:
```typescript
describe('Orders API', () => {
  it('should create a new order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send(orderData)
      .expect(201);
  });
});
```

### E2E Tests
Test the complete application flow using Playwright:
```typescript
test('Health check endpoint should be accessible', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
});
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Pushes to main/develop branches
- Deployment pipeline

The CI pipeline includes:
1. Unit and API tests
2. E2E tests
3. Security scanning
4. Coverage reporting
5. Railway deployment (on main branch)

## Coverage

Coverage reports are generated in the `coverage/` directory:
- HTML report: `coverage/index.html`
- LCOV report: `coverage/lcov.info`

## Debugging Tests

### Debug Unit/API Tests
```bash
npm run test:watch
```

### Debug E2E Tests
```bash
npx playwright test --debug
```

### View E2E Test Results
```bash
npx playwright show-report
```
