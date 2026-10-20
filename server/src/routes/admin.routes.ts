import { Router } from 'express';
import { AdminService } from '../services/admin.service.js';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all admin endpoints with authenticate and requireAdmin
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/stats
router.get('/stats', (req: AuthenticatedRequest, res, next) => {
  try {
    const stats = AdminService.getPlatformStats();
    res.json({ success: true, data: { stats } });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get('/users', (req: AuthenticatedRequest, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const result = AdminService.getUsers(q as string, Number(page), Number(limit));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', (req: AuthenticatedRequest, res, next) => {
  try {
    const updatedUser = AdminService.toggleUserStatus(req.user!._id, req.params.id);
    res.json({
      success: true,
      data: { user: updatedUser },
      message: `User account status changed to ${updatedUser.isActive ? 'Active' : 'Deactivated'}.`,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/logs
router.get('/logs', (req: AuthenticatedRequest, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const result = AdminService.getAuditLogs(Number(page), Number(limit));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/documents
router.get('/documents', (req: AuthenticatedRequest, res, next) => {
  try {
    const documents = AdminService.getDocumentsForModeration();
    res.json({ success: true, data: { documents } });
  } catch (err) {
    next(err);
  }
});

export default router;
