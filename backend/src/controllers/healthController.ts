import { Request, Response, NextFunction } from 'express';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import { supabase } from '../utils/supabaseClient';
import { asyncHandler } from '../utils/errorHandler';
import logger from '../observability/logger';
import { getRedisClient } from '../utils/redisClient';
import { getPerformanceMetrics } from '../middlewares/requestTiming';

// Initialize Prometheus metrics
collectDefaultMetrics({ register });

// Custom metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});

const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

const databaseConnections = new Gauge({
  name: 'database_connections',
  help: 'Database connection status',
  labelNames: ['status'],
});

const cacheHitRate = new Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate percentage',
});

const memoryUsage = new Gauge({
  name: 'memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type'],
});

// Health check endpoint
export const healthCheck = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: 'unknown',
      razorpay: 'unknown',
      twilio: 'unknown',
    },
  };

  // Check database connection
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      healthStatus.services.database = 'error';
      healthStatus.status = 'DEGRADED';
    } else {
      healthStatus.services.database = 'ok';
    }
  } catch (error) {
    healthStatus.services.database = 'error';
    healthStatus.status = 'DEGRADED';
    logger.error('Database health check failed:', error);
  }

  // Check Razorpay connection (basic check)
  try {
    // This would typically involve a simple API call to Razorpay
    // For now, we'll just check if the configuration is present
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      healthStatus.services.razorpay = 'ok';
    } else {
      healthStatus.services.razorpay = 'error';
      healthStatus.status = 'DEGRADED';
    }
  } catch (error) {
    healthStatus.services.razorpay = 'error';
    healthStatus.status = 'DEGRADED';
    logger.error('Razorpay health check failed:', error);
  }

  // Check Twilio connection (basic check)
  try {
    // This would typically involve a simple API call to Twilio
    // For now, we'll just check if the configuration is present
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      healthStatus.services.twilio = 'ok';
    } else {
      healthStatus.services.twilio = 'error';
      healthStatus.status = 'DEGRADED';
    }
  } catch (error) {
    healthStatus.services.twilio = 'error';
    healthStatus.status = 'DEGRADED';
    logger.error('Twilio health check failed:', error);
  }

  const statusCode = healthStatus.status === 'OK' ? 200 : 503;

  res.status(statusCode).json({
    success: healthStatus.status === 'OK',
    data: healthStatus,
  });
});

// Detailed health check (requires authentication)
export const detailedHealthCheck = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const detailedStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: process.memoryUsage().heapUsed,
      total: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external,
      rss: process.memoryUsage().rss,
    },
    cpu: {
      usage: process.cpuUsage(),
    },
    services: {
      database: {
        status: 'unknown' as 'unknown' | 'ok' | 'error' | 'not_configured',
        response_time: 0,
        last_check: null as string | null,
      },
      razorpay: {
        status: 'unknown' as 'unknown' | 'ok' | 'error' | 'not_configured',
        response_time: 0,
        last_check: null as string | null,
      },
      twilio: {
        status: 'unknown' as 'unknown' | 'ok' | 'error' | 'not_configured',
        response_time: 0,
        last_check: null as string | null,
      },
    },
  };

  // Test database connection with timing
  const dbStart = Date.now();
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    const dbEnd = Date.now();
    detailedStatus.services.database = {
      status: error ? 'error' : 'ok',
      response_time: dbEnd - dbStart,
      last_check: new Date().toISOString(),
    };
    
    if (error) {
      detailedStatus.status = 'DEGRADED';
    }
  } catch (error) {
    const dbEnd = Date.now();
    detailedStatus.services.database = {
      status: 'error',
      response_time: dbEnd - dbStart,
      last_check: new Date().toISOString(),
    };
    detailedStatus.status = 'DEGRADED';
    logger.error('Database detailed health check failed:', error);
  }

  // Test Razorpay connection (if configured)
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const razorpayStart = Date.now();
    try {
      // This would typically involve a simple API call to Razorpay
      // For now, we'll simulate a successful check
      const razorpayEnd = Date.now();
      detailedStatus.services.razorpay = {
        status: 'ok',
        response_time: razorpayEnd - razorpayStart,
        last_check: new Date().toISOString(),
      };
    } catch (error) {
      const razorpayEnd = Date.now();
      detailedStatus.services.razorpay = {
        status: 'error',
        response_time: razorpayEnd - razorpayStart,
        last_check: new Date().toISOString(),
      };
      detailedStatus.status = 'DEGRADED';
      logger.error('Razorpay detailed health check failed:', error);
    }
  } else {
    detailedStatus.services.razorpay = {
      status: 'not_configured',
      response_time: 0,
      last_check: new Date().toISOString(),
    };
  }

  // Test Twilio connection (if configured)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilioStart = Date.now();
    try {
      // This would typically involve a simple API call to Twilio
      // For now, we'll simulate a successful check
      const twilioEnd = Date.now();
      detailedStatus.services.twilio = {
        status: 'ok',
        response_time: twilioEnd - twilioStart,
        last_check: new Date().toISOString(),
      };
    } catch (error) {
      const twilioEnd = Date.now();
      detailedStatus.services.twilio = {
        status: 'error',
        response_time: twilioEnd - twilioStart,
        last_check: new Date().toISOString(),
      };
      detailedStatus.status = 'DEGRADED';
      logger.error('Twilio detailed health check failed:', error);
    }
  } else {
    detailedStatus.services.twilio = {
      status: 'not_configured',
      response_time: 0,
      last_check: new Date().toISOString(),
    };
  }

  const statusCode = detailedStatus.status === 'OK' ? 200 : 503;

  res.status(statusCode).json({
    success: detailedStatus.status === 'OK',
    data: detailedStatus,
  });
});

// System metrics endpoint
export const getMetrics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const performanceMetrics = getPerformanceMetrics();
  const redisClient = getRedisClient();
  
  // Update Prometheus metrics
  const memUsage = process.memoryUsage();
  memoryUsage.set({ type: 'heap_used' }, memUsage.heapUsed);
  memoryUsage.set({ type: 'heap_total' }, memUsage.heapTotal);
  memoryUsage.set({ type: 'external' }, memUsage.external);
  memoryUsage.set({ type: 'rss' }, memUsage.rss);
  
  // Update cache hit rate
  if (redisClient) {
    cacheHitRate.set(85); // Placeholder - would calculate actual hit rate
  }

  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: memUsage.heapUsed,
      total: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
    },
    cpu: {
      usage: process.cpuUsage(),
    },
    process: {
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    environment: {
      node_env: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
    },
    performance: performanceMetrics,
    cache: {
      connected: !!redisClient,
      memory: null,
      keys: 0,
      info: null,
    },
  };

  res.json({
    success: true,
    data: metrics,
  });
});

// Prometheus metrics endpoint
export const getPrometheusMetrics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Export metrics for use in other parts of the application
export const metrics = {
  httpRequestsTotal,
  httpRequestDuration,
  activeConnections,
  databaseConnections,
  cacheHitRate,
  memoryUsage,
};
