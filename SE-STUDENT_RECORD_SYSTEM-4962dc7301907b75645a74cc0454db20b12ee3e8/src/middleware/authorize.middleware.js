
const VALID_ROLES = new Set(['ADMIN', 'FACULTY', 'STUDENT']);

/**
 * Creates middleware that permits only the specified roles.
 *
 * Requires trusted authentication middleware to set req.user
 * with a verified role before this middleware runs.
 *
 * Example:
 * router.get('/admin', authenticate, authorizeRoles('ADMIN'), handler);
 */
function authorizeRoles(...allowedRoles) {
  if (allowedRoles.length === 0) {
    throw new Error('At least one allowed role must be specified.');
  }

  for (const role of allowedRoles) {
    if (!VALID_ROLES.has(role)) {
      throw new Error(`Invalid role configured: ${role}`);
    }
  }

  return function roleAuthorizationMiddleware(req, res, next) {
    // No verified identity means the user is not authenticated.
    if (!req.user || !VALID_ROLES.has(req.user.role)) {
      return res.status(401).json({
        error: 'Authentication required.',
      });
    }

    // Authenticated users must have a permitted role.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden: insufficient permissions.',
      });
    }

    return next();
  };
}

module.exports = {
  authorizeRoles,
};
