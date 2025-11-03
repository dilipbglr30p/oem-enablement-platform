import { Request, Response, NextFunction } from 'express';
import { performanceLog, requestLog } from '../observability/logger';
import { addBreadcrumb } from '../observability/sentry';

// Performance metrics storage
const performanceMetrics = {
  totalRequests: 0,
  totalResponseTime: 0,
  slowestRequest: { url: '', time: 0 },
  fastestRequest: { url: '', time: Infinity },
  averageResponseTime: 0,
};

// Request timing middleware
export const requestTiming = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Add breadcrumb for Sentry
  addBreadcrumb(
    `${req.method} ${req.url}`,
    'http',
    'info',
    {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    }
  );

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Log the request
    requestLog(req, res, responseTime);
    
    // Log performance metrics
    performanceLog(`${req.method} ${req.url}`, responseTime, {
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    
    // Update performance metrics
    updatePerformanceMetrics(req.url, responseTime);
    
    // Call original end and return its result
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Update performance metrics
const updatePerformanceMetrics = (url: string, responseTime: number) => {
  performanceMetrics.totalRequests++;
  performanceMetrics.totalResponseTime += responseTime;
  performanceMetrics.averageResponseTime = performanceMetrics.totalResponseTime / performanceMetrics.totalRequests;
  
  // Track slowest request
  if (responseTime > performanceMetrics.slowestRequest.time) {
    performanceMetrics.slowestRequest = { url, time: responseTime };
  }
  
  // Track fastest request
  if (responseTime < performanceMetrics.fastestRequest.time) {
    performanceMetrics.fastestRequest = { url, time: responseTime };
  }
};

// Get performance metrics
export const getPerformanceMetrics = () => ({
  ...performanceMetrics,
  timestamp: new Date().toISOString(),
});

// Reset performance metrics (useful for testing)
export const resetPerformanceMetrics = () => {
  performanceMetrics.totalRequests = 0;
  performanceMetrics.totalResponseTime = 0;
  performanceMetrics.slowestRequest = { url: '', time: 0 };
  performanceMetrics.fastestRequest = { url: '', time: Infinity };
  performanceMetrics.averageResponseTime = 0;
};

export default requestTiming;
