
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (
      typeof username !== 'string' ||
      !username.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        error: 'Username and password are required.',
      });
    }

    if (
      !process.env.JWT_SECRET ||
      process.env.JWT_SECRET.length < 32
    ) {
      return res.status(500).json({
        error: 'JWT_SECRET must be configured with at least 32 characters.',
      });
    }

    const [users] = await pool.execute(
      `SELECT user_id, username, password_hash, role
       FROM users
       WHERE username = ?
       LIMIT 1`,
      [username.trim()]
    );

    const user = users[0];

    if (
      !user ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({
        error: 'Invalid username or password.',
      });
    }

    const token = jwt.sign(
      {
        sub: String(user.user_id),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      tokenType: 'Bearer',
      user: {
        userId: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
