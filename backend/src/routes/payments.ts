import { Router } from 'express';
import {
  createPayment,
  verifyPaymentWebhook,
  getPayment,
  getPayments,
  processRefund,
  getPaymentStats,
} from '../controllers/paymentController';
import { verifyToken, optionalAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { paymentSchemas } from '../middlewares/validation';
import { paymentLimiter, generalLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Payment routes
router.post('/create-order', 
  generalLimiter,
  verifyToken,
  validate(paymentSchemas.createOrder),
  createPayment
);

router.post('/webhook',
  paymentLimiter,
  optionalAuth, // Webhooks don't require authentication
  validate(paymentSchemas.verify),
  verifyPaymentWebhook
);

router.get('/stats',
  generalLimiter,
  verifyToken,
  getPaymentStats
);

router.get('/:id',
  generalLimiter,
  verifyToken,
  getPayment
);

router.get('/',
  generalLimiter,
  verifyToken,
  getPayments
);

router.post('/refund',
  paymentLimiter,
  verifyToken,
  processRefund
);

export default router;
