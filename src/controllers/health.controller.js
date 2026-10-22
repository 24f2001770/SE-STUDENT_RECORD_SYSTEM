
const pool = require('../config/db');

async function getHealth(req, res) {
  const result = {
    status: 'ok',
    application: 'Student Record System API',
    database: 'not_checked',
  };

  try {
    await pool.query('SELECT 1');
    result.database = 'connected';

    return res.status(200).json(result);
  } catch (error) {
    result.status = 'degraded';
    result.database = 'disconnected';

    return res.status(503).json(result);
  }
}

module.exports = { getHealth };
