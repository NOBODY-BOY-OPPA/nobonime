import { Router } from 'express';
import { chapter } from '../controllers/mangaController.js';
const router = Router();
router.get('/:mangaId/chapters/:chapterId', chapter);
export default router;
