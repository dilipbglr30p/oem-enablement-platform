import { Router } from 'express';
import {
  healthCheck,
  detailedHealthCheck,
  getMetrics,
  getPrometheusMetrics,
} from '../controllers/healthController';
import { verifyToken } from '../middlewares/auth';

const router = Router();

// Health check routes (no authentication required for basic health check)
router.get('/', healthCheck);
router.get('/detailed', verifyToken, detailedHealthCheck);
router.get('/metrics', verifyToken, getMetrics);
router.get('/prometheus', getPrometheusMetrics);

export default router;
