import { cacheGet, cacheSet, cacheDelete, cacheInvalidate } from '../../src/utils/redisClient';

// Mock ioredis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    memory: jest.fn(),
    info: jest.fn(),
    dbsize: jest.fn(),
    quit: jest.fn(),
  }));
});

describe('Redis Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cacheSet', () => {
    it('should return false when Redis is not available', async () => {
      const result = await cacheSet('test-key', { data: 'test' });
      expect(result).toBe(false);
    });
  });

  describe('cacheGet', () => {
    it('should return null when Redis is not available', async () => {
      const result = await cacheGet('test-key');
      expect(result).toBeNull();
    });
  });

  describe('cacheDelete', () => {
    it('should return false when Redis is not available', async () => {
      const result = await cacheDelete('test-key');
      expect(result).toBe(false);
    });
  });

  describe('cacheInvalidate', () => {
    it('should return 0 when Redis is not available', async () => {
      const result = await cacheInvalidate('test-pattern');
      expect(result).toBe(0);
    });
  });
});
