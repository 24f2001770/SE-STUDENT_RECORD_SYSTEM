
const express = require('express');
const rateLimit = require('express-rate-limit');
const { login } = require('../controllers/auth.controller');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts. Try again later.',
  },
});

router.post('/login', loginLimiter, login);

module.exports = router;
