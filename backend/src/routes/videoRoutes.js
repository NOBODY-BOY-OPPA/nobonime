import { Router } from 'express';
import {
  searchVideo,
  getVideoDetails,
  getStream,
  getRelatedManga,
} from '../controllers/videoController.js';

const router = Router();

// 1. Recherche d'animés (ex: /api/video?q=naruto)
router.get('/', searchVideo);

// 2. Flux vidéo / Lecteur (ex: /api/video/12345/stream)
router.get('/:id/stream', getStream);

// 3. Passerelle Animé -> Manga (ex: /api/video/12345/manga)
router.get('/:id/manga', getRelatedManga);

// 4. Fiche détaillée d'un animé (ex: /api/video/12345)
router.get('/:id', getVideoDetails);

export default router;
