import { Router } from 'express';
import {
  sendWhatsApp,
  sendOrderConfirmationNotification,
  sendOrderStatusUpdateNotification,
  sendComplianceAlertNotification,
  getNotifications,
  getNotificationStats,
} from '../controllers/notificationController';
import { verifyToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { notificationSchemas } from '../middlewares/validation';
import { notificationLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Apply rate limiting to all routes
router.use(notificationLimiter);

// Apply authentication to all routes
router.use(verifyToken);

// Notification routes
router.post('/whatsapp', validate(notificationSchemas.whatsapp), sendWhatsApp);
router.post('/order-confirmation', sendOrderConfirmationNotification);
router.post('/order-status-update', sendOrderStatusUpdateNotification);
router.post('/compliance-alert', sendComplianceAlertNotification);
router.get('/', getNotifications);
router.get('/stats', getNotificationStats);

export default router;
