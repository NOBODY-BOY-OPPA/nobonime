import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { history, updateProfile } from '../controllers/userController.js';
const router = Router();
router.use(auth());
router.get('/history', history);
router.patch('/profile', updateProfile);
export default router;
