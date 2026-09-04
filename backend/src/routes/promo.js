import { Router } from 'express';
import { sendPromo } from '../services/whatsappPromoService.js';

const router = Router();

router.post('/whatsapp', async (req, res, next) => {
  try {
    const { message, imageUrl } = req.body || {};
    if (!message?.trim()) return res.status(400).json({ message: 'message is required' });
    const result = await sendPromo({ message: message.trim(), imageUrl: imageUrl || undefined });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
