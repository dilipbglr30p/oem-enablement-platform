import { Router } from 'express';
import {
  createCompliance,
  getCompliance,
  getComplianceById,
  updateCompliance,
  deleteCompliance,
  getComplianceStats,
  getUpcomingDeadlines,
} from '../controllers/complianceController';
import { verifyToken } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { complianceSchemas } from '../middlewares/validation';
import { generalLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Apply rate limiting to all routes
router.use(generalLimiter);

// Apply authentication to all routes
router.use(verifyToken);

// Compliance routes
router.post('/', validate(complianceSchemas.create), createCompliance);
router.get('/', getCompliance);
router.get('/stats', getComplianceStats);
router.get('/upcoming', getUpcomingDeadlines);
router.get('/:id', getComplianceById);
router.patch('/:id', validate(complianceSchemas.update), updateCompliance);
router.delete('/:id', deleteCompliance);

export default router;
