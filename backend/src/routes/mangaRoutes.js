import { Router } from 'express';
import {
  searchManga,
  getMangaDetails,
  getMangaChapters,
  chapter,
  getMangaDexPages,
  getAniListDetails,
  getTopMangas
} from '../controllers/mangaController.js';

const router = Router();

// ==========================================
// ROUTES STATIQUES (À placer avant les routes avec :mangaId)
// ==========================================

// 1. Recherche et catalogue (ex: /api/manga?q=naruto)
router.get('/', searchManga);

// 2. Top Mangas du moment via MyAnimeList (ex: /api/manga/top/mal)
router.get('/top/mal', getTopMangas);

// 3. Détails enrichis via AniList (ex: /api/manga/details/anilist?title=Naruto)
router.get('/details/anilist', getAniListDetails);

// 4. Lecteur alternatif via MangaDex (ex: /api/manga/mangadex/chapter/abcde)
router.get('/mangadex/chapter/:chapterId', getMangaDexPages);


// ==========================================
// ROUTES DYNAMIQUES (via ComicK)
// ==========================================

// 5. Fiche détaillée d'un manga (ex: /api/manga/12345)
router.get('/:mangaId', getMangaDetails);

// 6. Liste des chapitres d'un manga (ex: /api/manga/12345/chapters)
router.get('/:mangaId/chapters', getMangaChapters);

// 7. Images d'un chapitre pour le lecteur (ex: /api/manga/12345/chapters/abcde)
router.get('/:mangaId/chapters/:chapterId', chapter);

export default router;
