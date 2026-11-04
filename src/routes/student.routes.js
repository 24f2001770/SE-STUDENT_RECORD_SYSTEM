const express = require('express');
const {
  createStudent,
  updateStudent,
} = require('../controllers/student.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/authorize.middleware');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  createStudent
);

router.put(
  '/:studentId',
  authenticate,
  authorizeRoles('ADMIN'),
  updateStudent
);

module.exports = router;