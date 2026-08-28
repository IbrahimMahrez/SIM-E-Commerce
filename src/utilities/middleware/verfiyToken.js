import jwt from 'jsonwebtoken';

const jwtSecret = () => process.env.JWT_SECRET || 'SIM_STORE_DEVELOPMENT_SECRET';

export const verifyToken = (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Authentication token is required' });
  try {
    req.decoded = jwt.verify(token, jwtSecret());
    next();
  } catch {
    res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' });
  }
};

export { jwtSecret };
