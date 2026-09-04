import axios from 'axios';
import { resolveVideo } from '../services/video.js';

// 1. Recherche d'animés (via AniList)
export async function searchVideo(req, res, next) {
  try {
    const { q = 'Naruto' } = req.query;
    const query = `
      query ($search: String) {
        Page(perPage: 20) {
          media(search: $search, type: ANIME) {
            id
            title { romaji english native }
            coverImage { extraLarge large }
            bannerImage
            description
            episodes
            status
          }
        }
      }
    `;
    const { data } = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { search: q },
    });

    res.json(data.data.Page.media);
  } catch (e) {
    next(e);
  }
}

// 2. Fiche détaillée d'un animé (via AniList)
export async function getVideoDetails(req, res, next) {
  try {
    const { id } = req.params;
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title { romaji english native }
          coverImage { extraLarge }
          bannerImage
          description
          episodes
          genres
          averageScore
          status
        }
      }
    `;
    const { data } = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { id: parseInt(id, 10) },
    });

    res.json(data.data.Media);
  } catch (e) {
    next(e);
  }
}

// 3. Récupération du lecteur vidéo (via ton service video.js)
export async function getStream(req, res, next) {
  try {
    const stream = await resolveVideo(req.params.id);
    if (!stream) {
      return res.status(503).json({
        message: 'Video providers are not configured or unavailable',
      });
    }
    res.json(stream);
  } catch (e) {
    next(e);
  }
}

// 4. Passerelle Animé -> Manga / Webtoon
export async function getRelatedManga(req, res, next) {
  try {
    const { id } = req.params;
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          relations {
            edges {
              relationType
              node {
                id
                type
                title { romaji english }
                format
              }
            }
          }
        }
      }
    `;

    const { data } = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { id: parseInt(id, 10) },
    });

    const relations = data.data.Media.relations.edges || [];
    const mangaRelation = relations.find(
      (rel) => rel.relationType === 'ADAPTATION' || rel.node.type === 'MANGA'
    );

    if (!mangaRelation) {
      return res.status(404).json({
        message: 'Aucune adaptation manga ou webtoon trouvée pour cet animé.',
      });
    }

    res.json({
      mangaId: mangaRelation.node.id,
      title: mangaRelation.node.title,
      format: mangaRelation.node.format,
    });
  } catch (e) {
    next(e);
  }
}
