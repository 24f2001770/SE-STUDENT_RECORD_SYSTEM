const express = require('express');
const { listAuditLogs } = require('../controllers/audit.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  listAuditLogs
);

module.exports = router;