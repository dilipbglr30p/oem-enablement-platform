import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import logger from './observability/logger';
import { errorHandler, notFound } from './utils/errorHandler';
import { generalLimiter } from './middlewares/rateLimiter';
import { initSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from './observability/sentry';
import getRedisClient from './utils/redisClient';
import { requestTiming } from './middlewares/requestTiming';
import { auditLogging, securityEventLogging, dataAccessLogging } from './middlewares/auditLogging';

// Import routes
import ordersRoutes from './routes/orders';
import complianceRoutes from './routes/compliance';
import notifyRoutes from './routes/notify';
import paymentRoutes from './routes/payments';
import healthRoutes from './routes/health';

// Initialize observability services
initSentry();

// Initialize Redis client (gracefully handle failures)
const redisClient = getRedisClient();
if (redisClient) {
  logger.info('✅ Redis client initialized successfully');
} else {
  logger.warn('⚠️  Redis client unavailable - running without cache');
}

// Create Express app
const app = express();

// Trust proxy (for Railway deployment)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request timing middleware
app.use(requestTiming);

// Audit logging middleware
app.use(auditLogging);
app.use(securityEventLogging);
app.use(dataAccessLogging);

// Apply general rate limiting
app.use(generalLimiter);

// Sentry request handlers
if (config.sentry.dsn) {
  app.use(sentryRequestHandler);
  app.use(sentryTracingHandler);
}

// API routes
app.use('/api/orders', ordersRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/health', healthRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Textile OEM Platform API',
    version: '1.0.0',
    environment: config.env,
    timestamp: new Date().toISOString(),
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Textile OEM Platform API Documentation',
    version: '1.0.0',
    endpoints: {
      orders: {
        base: '/api/orders',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        description: 'Order management endpoints',
      },
      compliance: {
        base: '/api/compliance',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        description: 'Compliance management endpoints',
      },
      notifications: {
        base: '/api/notify',
        methods: ['GET', 'POST'],
        description: 'Notification endpoints',
      },
      payments: {
        base: '/api/payments',
        methods: ['GET', 'POST'],
        description: 'Payment processing endpoints',
      },
      health: {
        base: '/api/health',
        methods: ['GET'],
        description: 'Health check endpoints',
      },
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      description: 'JWT token required for most endpoints',
    },
  });
});

// 404 handler
app.use(notFound);

// Sentry error handler
if (config.sentry.dsn) {
  app.use(sentryErrorHandler);
}

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${config.env}`);
  logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
  logger.info(`📖 API Documentation: http://localhost:${PORT}/api`);
  logger.info(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
