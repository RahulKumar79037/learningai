import { Router } from 'express';
import { AIService } from '../services/ai.service.js';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { AIConversationsRepo, AIMessagesRepo, LearningActivitiesRepo } from '../models/repositories.js';
import { TutorMode } from '../models/types.js';

const router = Router();

// GET /api/tutor/conversations
router.get('/conversations', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const list = AIConversationsRepo.find(c => c.userId === req.user!._id)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    res.json({ success: true, data: { conversations: list } });
  } catch (err) {
    next(err);
  }
});

function parseTutorMode(mode: any): TutorMode {
  return mode === 'advanced' ? 'advanced' : 'beginner';
}

// POST /api/tutor/conversations
router.post('/conversations', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, mode = 'beginner', subjectId } = req.body;
    const conversation = AIConversationsRepo.insertOne({
      _id: 'conv_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      title: (title || 'New Tutoring Session').trim(),
      mode: parseTutorMode(mode),
      subjectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: { conversation } });
  } catch (err) {
    next(err);
  }
});

// GET /api/tutor/conversations/:id
router.get('/conversations/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const conv = AIConversationsRepo.findById(req.params.id);
    if (!conv || conv.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Conversation not found.' });
    }

    const messages = AIMessagesRepo.find(m => m.conversationId === conv._id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    res.json({ success: true, data: { conversation: { ...conv, mode: parseTutorMode(conv.mode) }, messages } });
  } catch (err) {
    next(err);
  }
});

// POST /api/tutor/conversations/:id/messages
router.post('/conversations/:id/messages', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const conv = AIConversationsRepo.findById(req.params.id);
    if (!conv || conv.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Conversation not found.' });
    }

    const { content, mode } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message content cannot be empty.' });
    }

    const currentMode = parseTutorMode(mode !== undefined ? mode : conv.mode);
    if (currentMode !== conv.mode) {
      AIConversationsRepo.updateById(conv._id, { mode: currentMode });
    }

    let userMsg: any = null;
    try {
      // 1. Store user message
      userMsg = AIMessagesRepo.insertOne({
        _id: 'msg_u_' + Date.now().toString(36),
        conversationId: conv._id,
        userId: req.user!._id,
        role: 'user',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      });

      // 2. Fetch history for context
      const history = AIMessagesRepo.find(m => m.conversationId === conv._id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(-10) // Last 10 messages for prompt window
        .map(m => ({ role: m.role, content: m.content }));

      // 3. Call Gemini
      const aiAnswer = await AIService.generateTutorResponse(history, currentMode);

      // 4. Store model response
      const modelMsg = AIMessagesRepo.insertOne({
        _id: 'msg_m_' + Date.now().toString(36),
        conversationId: conv._id,
        userId: req.user!._id,
        role: 'model',
        content: aiAnswer,
        createdAt: new Date().toISOString(),
      });

      // Update conversation title if first message
      const totalMsgs = AIMessagesRepo.count(m => m.conversationId === conv._id);
      if (totalMsgs <= 2 && conv.title === 'New Tutoring Session') {
        const generatedTitle = content.length > 35 ? content.substring(0, 32) + '...' : content;
        AIConversationsRepo.updateById(conv._id, { title: generatedTitle, updatedAt: new Date().toISOString() });
      } else {
        AIConversationsRepo.updateById(conv._id, { updatedAt: new Date().toISOString() });
      }

      // Record activity
      LearningActivitiesRepo.insertOne({
        _id: 'act_' + Date.now().toString(36),
        userId: req.user!._id,
        activityType: 'ai_chat',
        title: `AI Tutor Session: ${conv.title}`,
        details: `Asked: "${content.substring(0, 60)}${content.length > 60 ? '...' : ''}"`,
        timestamp: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: {
          userMessage: userMsg,
          modelMessage: modelMsg,
        },
      });
    } catch (err) {
      // Clean up orphan message if AI generation failed
      if (userMsg?._id) {
        AIMessagesRepo.deleteById(userMsg._id);
      }
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

// PATCH /api/tutor/conversations/:id
router.patch('/conversations/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const conv = AIConversationsRepo.findById(req.params.id);
    if (!conv || conv.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Conversation not found.' });
    }

    const { title, mode } = req.body;
    const updated = AIConversationsRepo.updateById(conv._id, {
      ...(title && { title: title.trim() }),
      ...(mode && { mode: parseTutorMode(mode) }),
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, data: { conversation: updated } });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tutor/conversations/:id
router.delete('/api/tutor/conversations/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const conv = AIConversationsRepo.findById(req.params.id);
    if (!conv || conv.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Conversation not found.' });
    }

    AIConversationsRepo.deleteById(conv._id);
    AIMessagesRepo.deleteMany(m => m.conversationId === conv._id);

    res.json({ success: true, message: 'Conversation deleted.' });
  } catch (err) {
    next(err);
  }
});

export default router;
