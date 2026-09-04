import { Router } from 'express';
import { getStream } from '../controllers/videoController.js';
const router = Router();
router.get('/:id/stream', getStream);
export default router;
