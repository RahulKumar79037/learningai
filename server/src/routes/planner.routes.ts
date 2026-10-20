import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import {
  StudyPlansRepo,
  StudyTasksRepo,
  StudySessionsRepo,
  SubjectsRepo,
  LearningActivitiesRepo,
} from '../models/repositories.js';

const router = Router();

// GET /api/planner
router.get('/', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const plan = StudyPlansRepo.findOne(p => p.userId === req.user!._id && p.status === 'active');
    const tasks = StudyTasksRepo.find(t => t.userId === req.user!._id)
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

    res.json({
      success: true,
      data: {
        plan,
        tasks,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/planner/generate (Generate or Update Plan)
router.post('/generate', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, dailyTargetMinutes = 90, selectedSubjects = [], weeklyTargetHours = 10 } = req.body;

    // Archive previous active plans
    const previous = StudyPlansRepo.find(p => p.userId === req.user!._id && p.status === 'active');
    for (const p of previous) {
      StudyPlansRepo.updateById(p._id, { status: 'archived' });
    }

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 14); // 2-week plan

    const newPlan = StudyPlansRepo.insertOne({
      _id: 'plan_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      title: (title || 'Personalized Computer Science Learning Plan').trim(),
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      dailyTargetMinutes: Number(dailyTargetMinutes) || 90,
      weeklyTargetHours: Number(weeklyTargetHours) || 10,
      selectedSubjects: Array.isArray(selectedSubjects) && selectedSubjects.length > 0 ? selectedSubjects : ['data-structures-and-algorithms', 'java-programming'],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: { plan: newPlan },
      message: 'New study plan activated successfully!',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/planner/tasks
router.post('/tasks', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, description, priority = 'medium', estimatedMinutes = 30, deadline, subjectId } = req.body;
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Task title is required.' });
    }

    const activePlan = StudyPlansRepo.findOne(p => p.userId === req.user!._id && p.status === 'active');

    const task = StudyTasksRepo.insertOne({
      _id: 'task_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      planId: activePlan?._id,
      subjectId,
      title: title.trim(),
      description: (description || '').trim(),
      priority,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      deadline,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
});

// PUT /api/planner/tasks/:id
router.put('/tasks/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const task = StudyTasksRepo.findById(req.params.id);
    if (!task || task.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    const { title, description, priority, estimatedMinutes, deadline } = req.body;
    const updated = StudyTasksRepo.updateById(task._id, {
      ...(title && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(priority && { priority }),
      ...(estimatedMinutes !== undefined && { estimatedMinutes: Number(estimatedMinutes) }),
      ...(deadline !== undefined && { deadline }),
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, data: { task: updated } });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/planner/tasks/:id/toggle
router.patch('/tasks/:id/toggle', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const task = StudyTasksRepo.findById(req.params.id);
    if (!task || task.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    const newCompleted = !task.completed;
    const updated = StudyTasksRepo.updateById(task._id, {
      completed: newCompleted,
      completedAt: newCompleted ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    });

    if (newCompleted) {
      LearningActivitiesRepo.insertOne({
        _id: 'act_' + Date.now().toString(36),
        userId: req.user!._id,
        activityType: 'topic_study',
        title: `Completed study task: ${task.title}`,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({ success: true, data: { task: updated } });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/planner/tasks/:id
router.delete('/tasks/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const task = StudyTasksRepo.findById(req.params.id);
    if (!task || task.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    StudyTasksRepo.deleteById(task._id);
    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/planner/sessions (Focus Timer / Study Session Recording)
router.post('/sessions', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const { durationMinutes = 25, sessionType = 'focus_timer', subjectId, topicId, notes } = req.body;

    const session = StudySessionsRepo.insertOne({
      _id: 'sess_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      subjectId,
      topicId,
      durationMinutes: Number(durationMinutes) || 25,
      sessionType,
      notes: (notes || '').trim(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    LearningActivitiesRepo.insertOne({
      _id: 'act_' + Date.now().toString(36),
      userId: req.user!._id,
      activityType: 'topic_study',
      title: `Completed Focus Study Session (${durationMinutes} mins)`,
      details: notes || `Focus timer session logged successfully.`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: { session }, message: 'Focus session recorded!' });
  } catch (err) {
    next(err);
  }
});

export default router;
