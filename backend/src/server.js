import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

// Import des routes (le .js est obligatoire avec "type": "module")
import catalogRoutes from './routes/catalog.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import authRoutes from './routes/auth.js';
import mangaRoutes from './routes/mangaRoutes.js';

const app = express();

// Configuration des origines autorisées (CORS)
const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',').map((x) => x.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) =>
    callback(null, !origin || !allowedOrigins.length || allowedOrigins.includes(origin)),
  credentials: true,
}));

// Middlewares globaux
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true }));

// Route de vérification (Santé de l'API)
app.get('/health', (_req, res) => res.json({ ok: true, service: 'nobonime-api' }));

// Montage des routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes); // Relie bien à tes endpoints animés !

// Middleware global de gestion des erreurs
app.use((err, _req, res, _next) => {
  console.error(err);
  
  // Erreurs de validation Zod
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      issues: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }
  
  // Erreur MongoDB : Email déjà utilisé
  if (err?.code === 11000) {
    return res.status(409).json({ message: 'This email is already registered' });
  }
  
  // Erreurs par défaut
  res.status(err.status || 500).json({ message: err.message || 'Unexpected server error' });
});

const port = Number(process.env.PORT || 4000);

// 1. Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nobonime')
  .then(() => console.log('MongoDB connecté avec succès'))
  .catch((error) => {
    console.error('MongoDB indisponible; API démarrée en mode dégradé.', error.message);
  });

// 2. Écoute locale (Ignoré par Vercel grâce à la condition)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Nobonime API écoute localement sur le port ${port}`));
}

// 3. Export pour Vercel (Serverless Functions)
export default app;
