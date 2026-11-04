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

    const [existingStudents] = await pool.execute(
      'SELECT student_id FROM students WHERE student_id = ?',
      [studentId]
    );

    if (existingStudents.length > 0) {
      return res.status(409).json({
        error: 'Student ID already exists. Please use a unique student ID.',
      });
    }

    const [existingEmails] = await pool.execute(
      'SELECT email FROM students WHERE email = ?',
      [studentEmail]
    );

    if (existingEmails.length > 0) {
      return res.status(409).json({
        error: 'Email address is already registered.',
      });
    }

    await pool.execute(
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
      if (error.message.includes('PRIMARY')) {
        return res.status(409).json({
          error: 'Student ID already exists.',
        });
      }

      if (error.message.includes('email')) {
        return res.status(409).json({
          error: 'Email address is already registered.',
        });
      }

      return res.status(409).json({
        error: 'A duplicate student record already exists.',
      });
    }

    return next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const studentId = String(req.params.studentId || '').trim();

    if (!studentId || studentId.length > 20) {
      return res.status(400).json({
        error: 'A valid student ID is required.',
      });
    }

    const {
      full_name,
      email,
      department,
      semester,
    } = req.body;

    const requiredFields = {
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
          error: `${field} is required.`,
        });
      }
    }

    const fullName = String(full_name).trim();
    const studentEmail = String(email).trim().toLowerCase();
    const studentDepartment = String(department).trim();
    const studentSemester = Number(semester);

    if (fullName.length > 100) {
      return res.status(400).json({
        error: 'Full name must not exceed 100 characters.',
      });
    }

    if (studentEmail.length > 255) {
      return res.status(400).json({
        error: 'Email must not exceed 255 characters.',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      return res.status(400).json({
        error: 'Please provide a valid email address.',
      });
    }

    if (studentDepartment.length > 100) {
      return res.status(400).json({
        error: 'Department must not exceed 100 characters.',
      });
    }

    if (
      !Number.isInteger(studentSemester) ||
      studentSemester < 1 ||
      studentSemester > 12
    ) {
      return res.status(400).json({
        error: 'Semester must be an integer between 1 and 12.',
      });
    }

    const [students] = await pool.execute(
      'SELECT student_id FROM students WHERE student_id = ?',
      [studentId]
    );

    if (students.length === 0) {
      return res.status(404).json({
        error: 'Student record not found.',
      });
    }

    const [existingEmails] = await pool.execute(
      'SELECT student_id FROM students WHERE email = ? AND student_id <> ?',
      [studentEmail, studentId]
    );

    if (existingEmails.length > 0) {
      return res.status(409).json({
        error: 'Email address is already registered to another student.',
      });
    }

    await pool.execute(
      `UPDATE students
       SET full_name = ?, email = ?, department = ?, semester = ?
       WHERE student_id = ?`,
      [
        fullName,
        studentEmail,
        studentDepartment,
        studentSemester,
        studentId,
      ]
    );

    return res.status(200).json({
      message: 'Student record updated successfully.',
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
        error: 'Email address is already registered.',
      });
    }

    return next(error);
  }
};