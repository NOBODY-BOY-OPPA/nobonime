import { resolveVideo } from '../services/video.js';
export async function getStream(req, res, next) { try { const stream = await resolveVideo(req.params.id); if (!stream) return res.status(503).json({ message: 'Video providers are not configured or unavailable' }); res.json(stream); } catch (e) { next(e); } }
