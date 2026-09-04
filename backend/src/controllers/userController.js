import User from '../models/User.js';
export async function history(req, res, next) { try { res.json(await User.findById(req.user.id).select('watchHistory chapterProgress')); } catch (e) { next(e); } }
export async function updateProfile(req, res, next) {
  try {
    const allowed = ['name', 'language'];
    const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true }).select('-passwordHash');
    res.json(user);
  } catch (e) { next(e); }
}
