import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import catalogRoutes from './routes/catalog.js';
import promoRoutes from './routes/promo.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import authRoutes from './routes/auth.js';
import mangaRoutes from './routes/mangaRoutes.js';

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',').map((x) => x.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) =>
    callback(null, !origin || !allowedOrigins.length || allowedOrigins.includes(origin)),
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'nobonime-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  // Zod validation error
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  // MongoDB duplicate key (race condition on unique field)
  if (err?.code === 11000) {
    return res.status(409).json({ message: 'This email is already registered' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Unexpected server error' });
});

const port = Number(process.env.PORT || 4000);

// 1. Connexion MongoDB (déconnectée du app.listen pour fonctionner sur Vercel)
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nobonime')
  .then(() => console.log('MongoDB connecté'))
  .catch((error) => {
    console.error('MongoDB unavailable; API will still start in degraded mode.', error.message);
  });

// 2. Écoute locale uniquement (Ignoré par Vercel qui utilise l'export)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Nobonime API listening locally on ${port}`));
}

// 3. Export indispensable pour les Serverless Functions Vercel (Format ES Module)
export default app;
