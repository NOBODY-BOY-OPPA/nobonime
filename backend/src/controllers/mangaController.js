import axios from 'axios';
import {
  searchManga as searchMangaService,
  getMangaDetails as getMangaDetailsService,
  getMangaChapters as getMangaChaptersService,
  getChapter,
} from '../services/comickService.js';

// ==========================================
// 1. ROUTES PRINCIPALES (via ComicK - Ton code d'origine)
// ==========================================

export async function searchManga(req, res, next) {
  try {
    const { q = '' } = req.query;
    res.json(await searchMangaService(q));
  } catch (e) {
    next(e);
  }
}

export async function getMangaDetails(req, res, next) {
  try {
    res.json(await getMangaDetailsService(req.params.mangaId));
  } catch (e) {
    next(e);
  }
}

export async function getMangaChapters(req, res, next) {
  try {
    res.json(await getMangaChaptersService(req.params.mangaId));
  } catch (e) {
    next(e);
  }
}

export async function chapter(req, res, next) {
  try {
    res.json(await getChapter(req.params.mangaId, req.params.chapterId));
  } catch (e) {
    next(e);
  }
}

// ==========================================
// 2. NOUVELLES ROUTES (MangaDex, AniList, Jikan)
// ==========================================

// Lecteur de pages alternatif (via MangaDex)
export async function getMangaDexPages(req, res, next) {
  try {
    const { chapterId } = req.params;
    const { data } = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
    
    const baseUrl = data.baseUrl;
    const hash = data.chapter.hash;
    const pageFiles = data.chapter.data;
    
    // Génère les liens directs des images
    const pages = pageFiles.map((file) => `${baseUrl}/data/${hash}/${file}`);

    res.json({ chapterId, pages });
  } catch (e) {
    next(e);
  }
}

// Détails enrichis (Bannières, Notes, Synopsis via AniList)
export async function getAniListDetails(req, res, next) {
  try {
    const { title = 'Naruto' } = req.query;
    const query = `
      query ($search: String) {
        Media (search: $search, type: MANGA) {
          id title { romaji english native } description
          coverImage { extraLarge large } bannerImage
          averageScore genres status
        }
      }
    `;
    const { data } = await axios.post('https://graphql.anilist.co', { 
      query, 
      variables: { search: title } 
    });
    
    res.json(data.data.Media);
  } catch (e) {
    next(e);
  }
}

// Top Mangas du moment (via Jikan / MyAnimeList)
export async function getTopMangas(req, res, next) {
  try {
    const { data } = await axios.get('https://api.jikan.moe/v4/top/manga', { 
      params: { limit: 20 } 
    });
    
    // On nettoie les données pour n'envoyer que l'essentiel au front-end
    const mangas = data.data.map((manga) => ({
      id: manga.mal_id,
      title: manga.title,
      image: manga.images.jpg.large_image_url,
      score: manga.score,
      synopsis: manga.synopsis,
    }));
    
    res.json(mangas);
  } catch (e) {
    next(e);
  }
}
