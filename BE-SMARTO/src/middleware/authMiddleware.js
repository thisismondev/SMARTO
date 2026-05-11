const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: 'Token not provided',
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or expired token',
    });
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
