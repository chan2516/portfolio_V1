import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { authRouter, protectWrites } from './auth.js';
import { validateLinkRequest } from './validateLinks.js';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db.js';
import { migrateUsers } from './migrateUsers.js';
import projectsRouter from './routes/projects.js';
import themeRouter from './routes/theme.js';
import mediaRouter, { uploadDir } from './routes/media.js';
import experienceRouter from './routes/experience.js';
import settingsRouter from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.TRUST_PROXY_HOPS) { const hops = Number(process.env.TRUST_PROXY_HOPS); if (!Number.isInteger(hops) || hops < 1 || hops > 5) throw new Error('Invalid TRUST_PROXY_HOPS'); app.set('trust proxy', hops); }

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir, { dotfiles: 'deny', setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff') }));

// SQLite Connection
export const databaseReady = migrateUsers(sequelize)
  .then(() => sequelize.sync()) // adds missing tables without changing portfolio data
  .then(() => { console.log('✅ Connected to SQLite database'); return true; })
  .catch(err => { console.error('Database initialization failed:', err.message); return false; });

// Wait for schema initialization before serving API requests.
app.use('/api', (req, res, next) => databaseReady.then(ready => ready ? next() : res.status(503).json({ message: 'Database is unavailable.' })));

// Routes
app.use('/api/auth', authRouter);
app.use('/api', protectWrites, validateLinkRequest);
app.use('/api/projects', projectsRouter);
app.use('/api/theme', themeRouter);
app.use('/api/media', mediaRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/settings', settingsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'devfolio-pro', message: 'API is running' });
});

app.use('/api', (req,res) => res.status(404).json({message:'API route not found.'}));
if (process.env.NODE_ENV === 'production') { const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist'); app.use(express.static(dist)); app.get('*', (req,res) => res.sendFile(path.join(dist,'index.html'))); }

app.use((error, req, res, next) => {
  const status = error.type === 'entity.too.large' ? 413 : error.type === 'entity.parse.failed' ? 400 : 500;
  res.status(status).json({ message: status === 413 ? 'Request is too large.' : status === 400 ? 'Send a valid JSON request.' : 'Could not complete this request.' });
});

if (process.env.NODE_ENV !== 'test') {
  const listener = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
  listener.on('error', error => {
    if (error.code === 'EADDRINUSE') { console.error(`Port ${PORT} is already in use. Run npm run dev:backend to reuse an existing portfolio API, or stop the duplicate backend.`); process.exitCode = 1; sequelize.close(); }
    else { console.error('API startup failed:', error.message); process.exitCode = 1; }
  });
}

export default app;
