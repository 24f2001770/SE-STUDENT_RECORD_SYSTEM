
const pool = require('../config/db');

exports.createStudent = async (req, res, next) => {
  try {
    const {
      student_id,
      full_name,
      email,
      department,
      semester,
    } = req.body;

    // Validate required fields.
    const requiredFields = {
      student_id,
      full_name,
      email,
      department,
      semester,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && !value.trim())
      ) {
        return res.status(400).json({
          error: `${field} is required`,
        });
      }
    }

    const studentId = String(student_id).trim();
    const fullName = String(full_name).trim();
    const studentEmail = String(email).trim().toLowerCase();
    const studentDepartment = String(department).trim();
    const studentSemester = Number(semester);

    if (studentId.length > 20) {
      return res.status(400).json({
        error: 'Student ID must not exceed 20 characters',
      });
    }

    if (fullName.length > 100) {
      return res.status(400).json({
        error: 'Full name must not exceed 100 characters',
      });
    }

    if (studentEmail.length > 255) {
      return res.status(400).json({
        error: 'Email must not exceed 255 characters',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      return res.status(400).json({
        error: 'Please provide a valid email address',
      });
    }

    if (studentDepartment.length > 100) {
      return res.status(400).json({
        error: 'Department must not exceed 100 characters',
      });
    }

    if (
      !Number.isInteger(studentSemester) ||
      studentSemester < 1 ||
      studentSemester > 12
    ) {
      return res.status(400).json({
        error: 'Semester must be an integer between 1 and 12',
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO students
        (student_id, full_name, email, department, semester)
       VALUES (?, ?, ?, ?, ?)`,
      [
        studentId,
        fullName,
        studentEmail,
        studentDepartment,
        studentSemester,
      ]
    );

    return res.status(201).json({
      message: 'Student record created successfully',
      student: {
        student_id: studentId,
        full_name: fullName,
        email: studentEmail,
        department: studentDepartment,
        semester: studentSemester,
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'A student with this ID or email already exists',
      });
    }

    return next(error);
  }
};
