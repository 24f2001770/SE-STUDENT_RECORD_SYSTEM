
const test = require('node:test');
const assert = require('node:assert/strict');

const { authorizeRoles } = require('../src/middleware/authorize.middleware');

function createResponse() {
  return {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function runMiddleware(middleware, user) {
  const req = { user };
  const res = createResponse();
  let nextCalled = false;

  middleware(req, res, () => {
    nextCalled = true;
  });

  return { res, nextCalled };
}

test('rejects requests without an authenticated user', () => {
  const result = runMiddleware(authorizeRoles('ADMIN'), undefined);

  assert.equal(result.res.statusCode, 401);
  assert.equal(result.nextCalled, false);
});

test('rejects users with an invalid role', () => {
  const result = runMiddleware(authorizeRoles('ADMIN'), {
    role: 'SUPERUSER',
  });

  assert.equal(result.res.statusCode, 401);
  assert.equal(result.nextCalled, false);
});

test('rejects a student from an admin-only operation', () => {
  const result = runMiddleware(authorizeRoles('ADMIN'), {
    userId: 12,
    role: 'STUDENT',
  });

  assert.equal(result.res.statusCode, 403);
  assert.equal(result.nextCalled, false);
});

test('allows an administrator through an admin-only operation', () => {
  const result = runMiddleware(authorizeRoles('ADMIN'), {
    userId: 1,
    role: 'ADMIN',
  });

  assert.equal(result.nextCalled, true);
  assert.equal(result.res.statusCode, 200);
});

test('allows faculty when faculty is an allowed role', () => {
  const result = runMiddleware(
    authorizeRoles('ADMIN', 'FACULTY'),
    { userId: 8, role: 'FACULTY' },
  );

  assert.equal(result.nextCalled, true);
});

test('rejects an invalid role configuration', () => {
  assert.throws(
    () => authorizeRoles('GUEST'),
    /Invalid role configured/,
  );
});

test('rejects an empty allowed-role configuration', () => {
  assert.throws(
    () => authorizeRoles(),
    /At least one allowed role/,
  );
});
