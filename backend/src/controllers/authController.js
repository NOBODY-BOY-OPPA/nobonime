import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const sign = (user) => jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'development-secret', { expiresIn: '7d' });
const publicUser = (user) => ({ id: user.id, email: user.email, name: user.name, language: user.language });
function credentials(body) {
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    const error = new Error('A valid email and a password of at least 8 characters are required');
    error.status = 400;
    throw error;
  }
  return { email, password };
}
export async function register(req, res, next) {
  try {
    const { email, password } = credentials(req.body);
    const user = await User.create({ email, name: String(req.body.name || '').trim().slice(0, 80) || undefined, passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (e) { next(e); }
}
export async function login(req, res, next) {
  try {
    const { email, password } = credentials(req.body);
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) { next(e); }
}
export async function me(req, res, next) { try { res.json(await User.findById(req.user.id).select('-passwordHash')); } catch (e) { next(e); } }
