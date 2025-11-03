import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock external services for testing
jest.mock('../src/utils/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          range: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
        })),
        order: jest.fn(() => ({
          eq: jest.fn(() => ({
            range: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
  TABLES: {
    ORDERS: 'orders',
    COMPLIANCE: 'compliance',
    USERS: 'users',
  },
  handleSupabaseError: jest.fn((error) => ({ message: 'Test error', status: 500 })),
}));

jest.mock('../src/utils/redisClient', () => ({
  initRedis: jest.fn(),
  getRedisClient: jest.fn(() => null),
  cacheGet: jest.fn(() => Promise.resolve(null)),
  cacheSet: jest.fn(() => Promise.resolve(true)),
  cacheDelete: jest.fn(() => Promise.resolve(true)),
  cacheInvalidate: jest.fn(() => Promise.resolve(0)),
  getCacheStats: jest.fn(() => Promise.resolve({ connected: false, memory: null, keys: 0, info: null })),
  cacheMiddleware: jest.fn(() => (req: any, res: any, next: any) => next()),
  closeRedis: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/observability/sentry', () => ({
  initSentry: jest.fn(),
  sentryRequestHandler: jest.fn(() => (req: any, res: any, next: any) => next()),
  sentryTracingHandler: jest.fn(() => (req: any, res: any, next: any) => next()),
  sentryErrorHandler: jest.fn(() => (err: any, req: any, res: any, next: any) => next(err)),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  addBreadcrumb: jest.fn(),
  setUserContext: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
}));

// Global test timeout
jest.setTimeout(10000);
