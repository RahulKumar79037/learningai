import path from 'path';
import fs from 'fs';
import { createApp } from './server/src/app.js';
import { initDatabase } from './server/src/config/db.js';
import { runSeed } from './server/src/seed/seed.js';
import { env } from './server/src/config/env.js';

async function startServer() {
  const app = createApp();

  // 1. Initialize Database & Seed initial curriculum / demo accounts
  try {
    await initDatabase();
    await runSeed(true);
  } catch (err) {
    console.error('Database initialization/seed error:', err);
  }

  // 2. Dev vs Production Frontend Mounting
  const isProd = env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'));

  if (!isProd) {
    // Development mode with Vite middlewareMode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted for development.');
  } else {
    // Production mode: serve built static assets from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    const express = (await import('express')).default;
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server] Serving production build from dist.');
  }

  // 3. Listen on port 3000 (required by environment)
  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 LEARNING COMPANION SERVER RUNNING`);
    console.log(`   URL: http://localhost:${port}`);
    console.log(`   Health: http://localhost:${port}/api/health`);
    console.log(`   Mode: ${env.NODE_ENV}`);
    console.log(`====================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
