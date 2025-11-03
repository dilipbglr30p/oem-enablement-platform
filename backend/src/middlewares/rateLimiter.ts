import rateLimit from 'express-rate-limit';
import { config } from '../config/env';
import logger from '../utils/logger';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later.',
    });
  },
});

// Payment rate limiter
export const paymentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 payment attempts per minute
  message: {
    success: false,
    error: 'Too many payment attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Payment rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many payment attempts, please try again later.',
    });
  },
});

// WhatsApp notification rate limiter
export const notificationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 notifications per minute
  message: {
    success: false,
    error: 'Too many notification attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Notification rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many notification attempts, please try again later.',
    });
  },
});
