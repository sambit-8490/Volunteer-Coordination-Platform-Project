const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Use Authorization: Bearer <token>'
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use Authorization: Bearer <token>'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const statusCode = error.name === 'TokenExpiredError' ? 401 : 401;
    const message = error.name === 'TokenExpiredError'
      ? 'Token has expired'
      : 'Invalid token';

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

module.exports = { verifyToken };
