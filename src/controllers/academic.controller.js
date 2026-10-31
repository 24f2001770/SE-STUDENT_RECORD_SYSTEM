
const pool = require('../config/db');

exports.getAcademicHistory = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    if (!studentId || studentId.length > 20) {
      return res.status(400).json({
        error: 'A valid student ID is required.',
      });
    }

    // Students can only view their own academic history.
    if (req.user.role === 'STUDENT') {
      if (
        !req.user.student_id ||
        req.user.student_id !== studentId
      ) {
        return res.status(403).json({
          error: 'You can only view your own academic history.',
        });
      }
    }

    // Verify that the student exists.
    const [students] = await pool.execute(
      `SELECT student_id, full_name
       FROM students
       WHERE student_id = ?`,
      [studentId]
    );

    if (!students.length) {
      return res.status(404).json({
        error: 'Student not found.',
      });
    }

    const [records] = await pool.execute(
      `SELECT
         record_id,
         course_code,
         course_name,
         semester,
         academic_year,
         grade,
         credits,
         status,
         created_at
       FROM academic_records
       WHERE student_id = ?
       ORDER BY semester ASC, academic_year ASC, course_code ASC`,
      [studentId]
    );

    return res.status(200).json({
      student: students[0],
      count: records.length,
      academic_history: records,
    });
  } catch (error) {
    return next(error);
  }
};
