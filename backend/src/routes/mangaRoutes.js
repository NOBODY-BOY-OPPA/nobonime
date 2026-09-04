import { Router } from 'express';
import {
  searchManga,
  getMangaDetails,
  getMangaChapters,
  chapter,
} from '../controllers/mangaController.js';

const router = Router();

// 1. Recherche et catalogue de mangas (ex: /api/manga?q=naruto)
router.get('/', searchManga);

// 2. Fiche détaillée d'un manga avec synopsis et genres (ex: /api/manga/12345)
router.get('/:mangaId', getMangaDetails);

// 3. Liste de tous les chapitres disponibles pour un manga (ex: /api/manga/12345/chapters)
router.get('/:mangaId/chapters', getMangaChapters);

// 4. Récupération des images d'un chapitre pour le lecteur (ex: /api/manga/12345/chapters/abcde)
router.get('/:mangaId/chapters/:chapterId', chapter);

export default router;
