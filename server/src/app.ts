import path from 'path';
import fs from 'fs';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import curriculumRoutes from './routes/curriculum.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import tutorRoutes from './routes/tutor.routes.js';
import notesRoutes from './routes/notes.routes.js';
import flashcardsRoutes from './routes/flashcards.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import documentRoutes from './routes/document.routes.js';
import plannerRoutes from './routes/planner.routes.js';
import searchRoutes from './routes/search.routes.js';
import adminRoutes from './routes/admin.routes.js';

export function createApp() {
  const app = express();

  // Trust reverse proxy (Cloud Run, Nginx, AI Studio preview proxy)
  app.set('trust proxy', 1);

  // Security Headers configured for AI Studio iframe environment
  app.use(
    helmet({
      contentSecurityPolicy: false, // Vite requires inline styles & scripts in dev
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
      frameguard: false,
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(cookieParser());

  // Global Rate Limiting
  app.use('/api', apiRateLimiter);

  // API Route Mounts
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/curriculum', curriculumRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/tutor', tutorRoutes);
  app.use('/api/notes', notesRoutes);
  app.use('/api/flashcards', flashcardsRoutes);
  app.use('/api/quizzes', quizRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/planner', plannerRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/admin', adminRoutes);

  // B.Tech Major Project Report PDF Download Endpoint
  app.get(['/api/project-report/download', '/api/project-report/pdf'], (req, res) => {
    const reportPath = path.resolve('public/Learning_Companion_Major_Project_Report.pdf');
    if (fs.existsSync(reportPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Learning_Companion_Major_Project_Report.pdf"');
      return res.sendFile(reportPath);
    }
    return res.status(404).json({ success: false, error: 'Project report PDF not found' });
  });

  app.get('/api/project-report/view', (req, res) => {
    const reportPath = path.resolve('public/Learning_Companion_Major_Project_Report.pdf');
    if (fs.existsSync(reportPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="Learning_Companion_Major_Project_Report.pdf"');
      return res.sendFile(reportPath);
    }
    return res.status(404).json({ success: false, error: 'Project report PDF not found' });
  });

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
