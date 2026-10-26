
const pool = require('../config/db');

async function recordAudit({
  userId,
  action,
  entityType,
  entityId = null,
  details = null,
}) {
  if (!action || typeof action !== 'string' || !action.trim()) {
    throw new Error('Audit action is required.');
  }

  if (
    !entityType ||
    typeof entityType !== 'string' ||
    !entityType.trim()
  ) {
    throw new Error('Audit entity type is required.');
  }

  if (userId !== undefined && userId !== null) {
    const parsedUserId = Number(userId);

    if (!Number.isSafeInteger(parsedUserId) || parsedUserId <= 0) {
      throw new Error('Audit user ID must be a positive integer.');
    }

    userId = parsedUserId;
  } else {
    userId = null;
  }

  const safeDetails =
    details === null ? null : JSON.stringify(details);

  const [result] = await pool.execute(
    `INSERT INTO audit_logs
      (user_id, action, entity_type, entity_id, details)
     VALUES (?, ?, ?, ?, ?)`,
    [
      userId,
      action.trim(),
      entityType.trim(),
      entityId === null ? null : String(entityId),
      safeDetails,
    ]
  );

  return result.insertId;
}

module.exports = { recordAudit };
