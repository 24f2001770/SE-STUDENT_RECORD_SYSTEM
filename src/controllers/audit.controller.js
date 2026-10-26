const pool = require('../config/db');

exports.listAuditLogs = async (req, res, next) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 50;

    const [logs] = await pool.execute(
      `SELECT
         a.audit_id,
         a.user_id,
         u.username,
         a.action,
         a.entity_type,
         a.entity_id,
         a.details,
         a.created_at
       FROM audit_logs a
       LEFT JOIN users u ON u.user_id = a.user_id
       ORDER BY a.created_at DESC, a.audit_id DESC
       LIMIT ?`,
      [limit]
    );

    return res.json({ count: logs.length, logs });
  } catch (error) {
    return next(error);
  }
};