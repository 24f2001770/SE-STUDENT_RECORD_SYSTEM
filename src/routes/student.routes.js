
const express = require('express');

const {
  createStudent,
  searchStudents,
} = require('../controllers/student.controller');

const {
  getAcademicHistory,
} = require('../controllers/academic.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/authorize.middleware');

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  createStudent
);

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FACULTY', 'STUDENT'),
  searchStudents
);

router.get(
  '/:studentId/academic-history',
  authenticate,
  authorizeRoles('ADMIN', 'FACULTY', 'STUDENT'),
  getAcademicHistory
);

module.exports = router;
