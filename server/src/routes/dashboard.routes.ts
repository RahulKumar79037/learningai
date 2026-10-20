import { Router } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/dashboard
router.get('/', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const data = AnalyticsService.getDashboardData(req.user!._id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/dashboard/trends
router.get('/trends', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const data = AnalyticsService.getAnalyticsTrends(req.user!._id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
