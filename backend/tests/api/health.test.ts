import request from 'supertest';
import express from 'express';
import healthRoutes from '../../src/routes/health';

const app = express();
app.use(express.json());
app.use('/api/health', healthRoutes);

describe('Health API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('services');
    });
  });

  describe('GET /api/health/detailed', () => {
    it('should return detailed health status', async () => {
      const response = await request(app)
        .get('/api/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data).toHaveProperty('cpu');
      expect(response.body.data).toHaveProperty('services');
    });
  });

  describe('GET /api/health/metrics', () => {
    it('should return system metrics', async () => {
      const response = await request(app)
        .get('/api/health/metrics')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('memory');
      expect(response.body.data).toHaveProperty('cpu');
      expect(response.body.data).toHaveProperty('process');
      expect(response.body.data).toHaveProperty('environment');
    });
  });

  describe('GET /api/health/prometheus', () => {
    it('should return Prometheus metrics', async () => {
      const response = await request(app)
        .get('/api/health/prometheus')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/plain');
      expect(response.text).toContain('# HELP');
    });
  });
});
