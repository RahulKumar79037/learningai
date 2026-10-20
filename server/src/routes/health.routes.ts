import { Router } from 'express';
import { getDatabaseStatus } from '../config/db.js';
import { isGeminiAvailable } from '../config/gemini.js';
import { env } from '../config/env.js';

const router = Router();

// GET /api/health
router.get('/', (req, res) => {
  const dbStatus = getDatabaseStatus();
  const geminiAvailable = isGeminiAvailable();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
    database: {
      type: dbStatus.type,
      connected: dbStatus.connected,
      message: dbStatus.message,
      ...(dbStatus.host && { host: dbStatus.host }),
      ...(dbStatus.databaseName && { databaseName: dbStatus.databaseName }),
    },
    ai: {
      provider: 'Google Gemini',
      model: env.GEMINI_MODEL,
      configured: geminiAvailable,
      message: geminiAvailable
        ? 'Gemini API is configured and operational.'
        : 'GEMINI_API_KEY is not set. Configure it in Settings > Secrets to enable AI Tutor, Notes, and Quizzes.',
    },
  });
});

// GET /api/health/ready
router.get('/ready', (req, res) => {
  const dbStatus = getDatabaseStatus();
  if (dbStatus.connected) {
    res.json({ ready: true, status: 'ready' });
  } else {
    res.status(503).json({ ready: false, status: 'initializing' });
  }
});

export default router;
