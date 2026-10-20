import { Router } from 'express';
import { CurriculumService } from '../services/curriculum.service.js';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/curriculum/subjects
router.get('/subjects', (req, res, next) => {
  try {
    const subjects = CurriculumService.getAllSubjects();
    res.json({ success: true, data: { subjects } });
  } catch (err) {
    next(err);
  }
});

// GET /api/curriculum/subjects/:slug
router.get('/subjects/:slug', (req, res, next) => {
  try {
    const subject = CurriculumService.getSubjectBySlug(req.params.slug);
    res.json({ success: true, data: { subject } });
  } catch (err) {
    next(err);
  }
});

// GET /api/curriculum/subjects/:subjectSlug/topics/:topicSlug
router.get('/subjects/:subjectSlug/topics/:topicSlug', (req, res, next) => {
  try {
    const topic = CurriculumService.getTopicBySlug(req.params.subjectSlug, req.params.topicSlug);
    res.json({ success: true, data: { topic } });
  } catch (err) {
    next(err);
  }
});

// POST /api/curriculum/subjects/:subjectSlug/topics/:topicSlug/complete
router.post('/subjects/:subjectSlug/topics/:topicSlug/complete', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const result = CurriculumService.markTopicCompleted(req.user!._id, req.params.subjectSlug, req.params.topicSlug);
    res.json({ success: true, data: result, message: 'Module marked as completed!' });
  } catch (err) {
    next(err);
  }
});

export default router;
