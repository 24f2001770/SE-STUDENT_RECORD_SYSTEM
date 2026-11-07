
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const healthRoutes = require('./src/routes/health.routes');
const authRoutes = require('./src/routes/auth.routes');
const { authenticate } = require('./src/middleware/auth.middleware');
const { authorizeRoles } = require('./src/middleware/authorize.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', (req, res) => {
  res.json({
    message: 'Student Record System API',
    version: '1.0.0',
  });
});

app.use('/api/health', healthRoutes);

app.use('/api/auth', authRoutes);

// Protected endpoint for testing role-based access.
app.get(
  '/api/admin/access-check',
  authenticate,
  authorizeRoles('ADMIN'),
  (req, res) => {
    res.json({
      message: 'Admin access granted.',
      user: {
        userId: req.user.user_id,
        username: req.user.username,
        role: req.user.role,
      },
    });
  }
);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Internal server error',
  });
});

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  console.log(`Student Record System API running on port ${PORT}`);
});
