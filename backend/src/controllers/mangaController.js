import { getChapter } from '../services/comickService.js';
export async function chapter(req, res, next) { try { res.json(await getChapter(req.params.mangaId, req.params.chapterId)); } catch (e) { next(e); } }
