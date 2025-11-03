import * as Sentry from '@sentry/node';
import { config } from '../config/env';
import logger from './logger';

// Initialize Sentry with comprehensive configuration
export const initSentry = () => {
  if (!config.sentry.dsn) {
    logger.warn('Sentry DSN not provided, skipping Sentry initialization');
    return;
  }

  try {
    Sentry.init({
      dsn: config.sentry.dsn,
      environment: config.env,
      release: config.app.version,
      
      // Performance monitoring
      tracesSampleRate: config.env === 'production' ? 0.1 : 1.0,
      
      // Error sampling
      sampleRate: config.env === 'production' ? 0.1 : 1.0,
      
      // Profiling
      profilesSampleRate: config.env === 'production' ? 0.1 : 1.0,
      
      // Integrations
      integrations: [
        Sentry.httpIntegration(),
        Sentry.expressIntegration(),
        Sentry.onUncaughtExceptionIntegration({
          onFatalError: (err: Error) => {
            logger.error('Fatal error caught by Sentry:', err);
            process.exit(1);
          },
        }),
        Sentry.onUnhandledRejectionIntegration({ mode: 'warn' }),
      ],
      
      // Before send hook to filter sensitive data
      beforeSend(event, hint) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
          delete event.request.headers['x-api-key'];
        }
        
        // Remove sensitive data from breadcrumbs
        if (event.breadcrumbs) {
          event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
            if (breadcrumb.data) {
              delete breadcrumb.data.password;
              delete breadcrumb.data.token;
              delete breadcrumb.data.secret;
            }
            return breadcrumb;
          });
        }
        
        return event;
      },
      
      // Tags for better filtering
      initialScope: {
        tags: {
          component: 'backend-api',
          version: config.app.version,
        },
      },
    });

    logger.info('Sentry initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Sentry:', error);
  }
};

// Sentry middleware for Express - simplified for current version
export const sentryRequestHandler = (req: any, res: any, next: any) => {
  // Basic request handler - Sentry will automatically track requests
  next();
};

export const sentryTracingHandler = (req: any, res: any, next: any) => {
  // Basic tracing handler - Sentry will automatically trace
  next();
};

export const sentryErrorHandler = (err: any, req: any, res: any, next: any) => {
  // Capture error and pass to next error handler
  Sentry.captureException(err);
  next(err);
};

// Helper function to capture exceptions
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    Sentry.captureException(error);
  });
  logger.error('Exception captured by Sentry:', error);
};

// Helper function to capture messages
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional_info', context);
    }
    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
  logger[level](`Message captured by Sentry: ${message}`);
};

// Helper function to add breadcrumbs
export const addBreadcrumb = (message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
};

// Helper function to set user context
export const setUserContext = (user: { id: string; email?: string; role?: string }) => {
  Sentry.setUser(user);
};

// Helper function to set tags
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

// Helper function to set context
export const setContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};

export default Sentry;