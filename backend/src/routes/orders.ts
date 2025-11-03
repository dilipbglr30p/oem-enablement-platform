import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderStats,
} from '../controllers/ordersController';
import { verifyToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { orderSchemas } from '../middlewares/validation';
import { generalLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Apply rate limiting to all routes
router.use(generalLimiter);

// Apply authentication to all routes
router.use(verifyToken);

// Order routes
router.post('/', validate(orderSchemas.create), createOrder);
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrderById);
router.patch('/:id', validate(orderSchemas.update), updateOrder);
router.delete('/:id', deleteOrder);

export default router;
