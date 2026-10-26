
const test = require('node:test');
const assert = require('node:assert/strict');
const { recordAudit } = require('../src/services/audit.service');

test('rejects audit records without an action', async () => {
  await assert.rejects(
    recordAudit({
      userId: 1,
      action: '',
      entityType: 'student',
    }),
    /Audit action is required/
  );
});

test('rejects audit records without an entity type', async () => {
  await assert.rejects(
    recordAudit({
      userId: 1,
      action: 'UPDATE',
      entityType: '',
    }),
    /Audit entity type is required/
  );
});

test('rejects whitespace-only actions', async () => {
  await assert.rejects(
    recordAudit({
      userId: 1,
      action: '   ',
      entityType: 'student',
    }),
    /Audit action is required/
  );
});

test('rejects whitespace-only entity types', async () => {
  await assert.rejects(
    recordAudit({
      userId: 1,
      action: 'UPDATE',
      entityType: '   ',
    }),
    /Audit entity type is required/
  );
});

test('rejects invalid user IDs', async () => {
  await assert.rejects(
    recordAudit({
      userId: -1,
      action: 'UPDATE',
      entityType: 'student',
    }),
    /Audit user ID must be a positive integer/
  );
});
