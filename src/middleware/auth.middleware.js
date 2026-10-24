
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Authentication required.',
    });
  }

  if (!process.env.JWT_SECRET ||
      process.env.JWT_SECRET.length < 32) {
    return res.status(500).json({
      error: 'Authentication is not configured.',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await pool.execute(
      `SELECT user_id, username, role
       FROM users
       WHERE user_id = ? AND role = ?`,
      [payload.sub, payload.role]
    );

    if (!users.length) {
      return res.status(401).json({
        error: 'User account is no longer valid.',
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        error: 'Invalid or expired token.',
      });
    }

    next(error);
  }
}

module.exports = { authenticate };
