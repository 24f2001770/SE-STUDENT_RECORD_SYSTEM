
require('dotenv').config();

const test = require('node:test');
const assert = require('node:assert/strict');
const pool = require('../src/config/db');
const { recordAudit } = require('../src/services/audit.service');

test('records an audit event in MySQL', async (t) => {
  if (process.env.RUN_DB_TESTS !== 'true') {
    t.skip('Set RUN_DB_TESTS=true to run database integration tests.');
    return;
  }

  const action = `TEST_${Date.now()}`;
  let auditId;

  try {
    auditId = await recordAudit({
      userId: null,
      action,
      entityType: 'test',
      entityId: 'integration-test',
      details: { test: true },
    });

    assert.ok(auditId);

    const [rows] = await pool.execute(
      `SELECT audit_id, action, entity_type, entity_id, details
       FROM audit_logs
       WHERE audit_id = ?`,
      [auditId]
    );

    assert.equal(rows.length, 1);
    assert.equal(rows[0].action, action);
    assert.equal(rows[0].entity_type, 'test');
    assert.equal(rows[0].entity_id, 'integration-test');
  } finally {
    if (auditId) {
      await pool.execute(
        'DELETE FROM audit_logs WHERE audit_id = ?',
        [auditId]
      );
    }

    await pool.end();
  }
});
