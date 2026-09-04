import jwt from 'jsonwebtoken';
export function auth(required = true) {
  return (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return required ? res.status(401).json({ message: 'Authentication required' }) : next();
    try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'development-secret'); next(); }
    catch { return res.status(401).json({ message: 'Invalid session' }); }
  };
}
