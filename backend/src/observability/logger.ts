import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from '../config/env';
import { captureException, captureMessage } from './sentry';

// Ensure logs directory exists
import { mkdirSync } from 'fs';
import { join } from 'path';

const logsDir = join(process.cwd(), 'logs');
try {
  mkdirSync(logsDir, { recursive: true });
} catch (error) {
  // Directory might already exist
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define which transports the logger must use
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    level: config.env === 'development' ? 'debug' : 'info',
  }),
];

// Add file transports
transports.push(
  // Error log with daily rotation
  new DailyRotateFile({
    filename: join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    format: fileFormat,
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true,
  }),
  
  // Combined log with daily rotation
  new DailyRotateFile({
    filename: join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    format: fileFormat,
    maxSize: '20m',
    maxFiles: '30d',
    zippedArchive: true,
  }),
  
  // Audit log with daily rotation (JSON lines format)
  new DailyRotateFile({
    filename: join(logsDir, 'audit-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxSize: '20m',
    maxFiles: '90d', // Keep audit logs longer
    zippedArchive: true,
  })
);

// Create the logger
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  levels,
  transports,
  exitOnError: false,
});

// Add Sentry integration for error logs
const originalError = logger.error.bind(logger);
logger.error = (message: any, meta?: any) => {
  originalError(message, meta);
  
  // Send to Sentry if it's an error
  if (meta instanceof Error) {
    captureException(meta, { message, level: 'error' });
  } else if (typeof message === 'string' && message.includes('error')) {
    captureMessage(message, 'error', meta);
  }
  
  return logger;
};

// Add Sentry integration for warn logs
const originalWarn = logger.warn.bind(logger);
logger.warn = (message: any, meta?: any) => {
  originalWarn(message, meta);
  
  // Send warnings to Sentry in production
  if (config.env === 'production') {
    captureMessage(message, 'warning', meta);
  }
  
  return logger;
};

// Create a stream object with a 'write' function for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Audit logging function
export const auditLog = (action: string, userId?: string, details?: Record<string, any>) => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: userId || 'system',
    details: details || {},
    ip: 'unknown', // Will be set by middleware
    userAgent: 'unknown', // Will be set by middleware
  };
  
  logger.info('AUDIT', auditEntry);
};

// Performance logging function
export const performanceLog = (operation: string, duration: number, metadata?: Record<string, any>) => {
  const perfEntry = {
    timestamp: new Date().toISOString(),
    operation,
    duration,
    metadata: metadata || {},
  };
  
  logger.info('PERFORMANCE', perfEntry);
};

// Security logging function
export const securityLog = (event: string, details: Record<string, any>) => {
  const securityEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
  };
  
  logger.warn('SECURITY', securityEntry);
  
  // Send security events to Sentry
  captureMessage(`Security event: ${event}`, 'warning', details);
};

// Request logging function
export const requestLog = (req: any, res: any, responseTime: number) => {
  const requestEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
  };
  
  logger.http('REQUEST', requestEntry);
};

export default logger;
