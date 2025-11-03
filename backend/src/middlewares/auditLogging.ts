import { Request, Response, NextFunction } from 'express';
import { auditLog, securityLog } from '../observability/logger';
import { addBreadcrumb } from '../observability/sentry';

// Audit logging middleware
export const auditLogging = (req: Request, res: Response, next: NextFunction) => {
  // Skip audit logging for health checks and metrics
  if (req.path === '/api/health' || req.path === '/api/metrics') {
    return next();
  }

  // Capture request details
  const requestDetails = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
    headers: {
      'content-type': req.get('Content-Type'),
      'authorization': req.get('Authorization') ? '[REDACTED]' : undefined,
      'x-forwarded-for': req.get('X-Forwarded-For'),
      'x-real-ip': req.get('X-Real-IP'),
    },
  };

  // Add breadcrumb for Sentry
  addBreadcrumb(
    `API Request: ${req.method} ${req.url}`,
    'http',
    'info',
    {
      method: req.method,
      url: req.url,
      userId: requestDetails.userId,
    }
  );

  // Log the request
  auditLog(
    'API_REQUEST',
    requestDetails.userId,
    {
      ...requestDetails,
      action: 'request_received',
    }
  );

  // Override res.json to capture response details
  const originalJson = res.json;
  res.json = function(body: any) {
    const responseDetails = {
      statusCode: res.statusCode,
      responseTime: Date.now() - (req as any).startTime,
      success: res.statusCode >= 200 && res.statusCode < 300,
    };

    // Log the response
    auditLog(
      'API_RESPONSE',
      requestDetails.userId,
      {
        ...requestDetails,
        ...responseDetails,
        action: 'response_sent',
        responseSize: JSON.stringify(body).length,
      }
    );

    // Log security events for failed requests
    if (res.statusCode >= 400) {
      securityLog('API_ERROR', {
        ...requestDetails,
        ...responseDetails,
        errorType: res.statusCode >= 500 ? 'server_error' : 'client_error',
      });
    }

    return originalJson.call(this, body);
  };

  next();
};

// Security event logging middleware
export const securityEventLogging = (req: Request, res: Response, next: NextFunction) => {
  // Log authentication attempts
  if (req.path.includes('/login') || req.path.includes('/auth')) {
    const authDetails = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    };

    // Override res.json to capture auth results
    const originalJson = res.json;
    res.json = function(body: any) {
      const isSuccess = res.statusCode === 200;
      
      securityLog(
        isSuccess ? 'AUTH_SUCCESS' : 'AUTH_FAILURE',
        {
          ...authDetails,
          success: isSuccess,
          userId: body?.user?.id || 'unknown',
        }
      );

      return originalJson.call(this, body);
    };
  }

  // Log rate limit violations
  if (res.statusCode === 429) {
    securityLog('RATE_LIMIT_EXCEEDED', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

// Data access logging middleware
export const dataAccessLogging = (req: Request, res: Response, next: NextFunction) => {
  // Log data access for sensitive endpoints
  const sensitiveEndpoints = ['/api/orders', '/api/compliance', '/api/payments'];
  const isSensitiveEndpoint = sensitiveEndpoints.some(endpoint => req.path.startsWith(endpoint));

  if (isSensitiveEndpoint) {
    const dataAccessDetails = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: (req as any).user?.id || 'anonymous',
      timestamp: new Date().toISOString(),
      resource: req.path.split('/')[2], // Extract resource type
    };

    // Override res.json to capture data access
    const originalJson = res.json;
    res.json = function(body: any) {
      auditLog(
        'DATA_ACCESS',
        dataAccessDetails.userId,
        {
          ...dataAccessDetails,
          action: req.method.toLowerCase(),
          recordCount: Array.isArray(body?.data) ? body.data.length : 1,
          success: res.statusCode >= 200 && res.statusCode < 300,
        }
      );

      return originalJson.call(this, body);
    };
  }

  next();
};

export default auditLogging;
