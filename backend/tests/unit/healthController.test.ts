import { Request, Response, NextFunction } from 'express';
import { healthCheck, getMetrics, getPrometheusMetrics } from '../../src/controllers/healthController';

// Mock the dependencies
jest.mock('../../src/utils/supabaseClient');
jest.mock('../../src/utils/redisClient');
jest.mock('../../src/middlewares/requestTiming');

describe('Health Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      await healthCheck(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            status: 'OK',
            timestamp: expect.any(String),
            uptime: expect.any(Number),
            environment: expect.any(String),
            version: expect.any(String),
            services: expect.objectContaining({
              database: expect.any(String),
              razorpay: expect.any(String),
              twilio: expect.any(String),
            }),
          }),
        })
      );
    });
  });

  describe('getMetrics', () => {
    it('should return system metrics', async () => {
      await getMetrics(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            timestamp: expect.any(String),
            uptime: expect.any(Number),
            memory: expect.objectContaining({
              used: expect.any(Number),
              total: expect.any(Number),
              external: expect.any(Number),
              rss: expect.any(Number),
            }),
            cpu: expect.objectContaining({
              usage: expect.any(Object),
            }),
            process: expect.objectContaining({
              pid: expect.any(Number),
              version: expect.any(String),
              platform: expect.any(String),
              arch: expect.any(String),
            }),
            environment: expect.objectContaining({
              node_env: expect.any(String),
              port: expect.any(Number),
            }),
            performance: expect.any(Object),
            cache: expect.any(Object),
          }),
        })
      );
    });
  });

  describe('getPrometheusMetrics', () => {
    it('should return Prometheus metrics', async () => {
      await getPrometheusMetrics(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.set).toHaveBeenCalledWith('Content-Type', expect.any(String));
      expect(mockRes.end).toHaveBeenCalled();
    });
  });
});
