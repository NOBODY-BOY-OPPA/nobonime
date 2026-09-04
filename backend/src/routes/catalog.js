import { Router } from 'express';
import axios from 'axios';
import { resolveVideo } from '../services/video.js';
const router = Router();
router.get('/', async (req, res, next) => {
  const endpoint = process.env.CATALOG_API_URL;
  if (!endpoint) return res.json({ items: [], page: Number(req.query.page || 1), total: 0, configured: false });
  try {
    const response = await axios.get(endpoint, {
      params: { query: req.query.query || '', page: req.query.page || 1 },
      headers: process.env.CATALOG_API_KEY ? { Authorization: 'Bearer ' + process.env.CATALOG_API_KEY } : {},
      timeout: 10_000
    });
    const payload = response.data;
    const items = Array.isArray(payload) ? payload : (payload.items || payload.data || []);
    res.json({ items, page: Number(req.query.page || 1), total: payload.total ?? items.length, configured: true });
  } catch (error) { next(error); }
});
router.get('/:id/stream', async (req, res, next) => { try { const stream = await resolveVideo(req.params.id); if (!stream) return res.status(404).json({ message: 'No stream available' }); res.json(stream); } catch (e) { next(e); } });
export default router;
