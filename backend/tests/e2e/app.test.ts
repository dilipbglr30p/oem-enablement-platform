import { test, expect } from '@playwright/test';

test.describe('Backend E2E Tests', () => {
  const baseURL = process.env.TEST_BASE_URL || 'http://localhost:3000';

  test('Health check endpoint should be accessible', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('status');
    expect(data.data).toHaveProperty('uptime');
  });

  test('API documentation endpoint should return valid structure', async ({ request }) => {
    const response = await request.get(`${baseURL}/api`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('API Documentation');
    expect(data).toHaveProperty('endpoints');
    expect(data.endpoints).toHaveProperty('orders');
    expect(data.endpoints).toHaveProperty('compliance');
    expect(data.endpoints).toHaveProperty('health');
  });

  test('Root endpoint should return API info', async ({ request }) => {
    const response = await request.get(`${baseURL}/`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain('Textile OEM Platform API');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('environment');
  });

  test('Prometheus metrics endpoint should return metrics', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health/prometheus`);
    expect(response.status()).toBe(200);
    
    const text = await response.text();
    expect(text).toContain('# HELP');
    expect(text).toContain('# TYPE');
  });

  test('Non-existent endpoint should return 404', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/non-existent`);
    expect(response.status()).toBe(404);
  });

  test('CORS headers should be present', async ({ request }) => {
    const response = await request.options(`${baseURL}/api/health`);
    expect(response.headers()['access-control-allow-origin']).toBeDefined();
    expect(response.headers()['access-control-allow-methods']).toBeDefined();
  });
});
