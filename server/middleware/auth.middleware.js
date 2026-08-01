const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes requiring authentication
 */
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'applymate_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    // Attach user details to request object
    req.user = {
      id: decoded.id,
      _id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token invalid or expired.',
    });
  }
};

module.exports = { protect };
