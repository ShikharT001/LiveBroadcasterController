const config = require('../config/env');

function authenticate(req, res, next) {
  // Allow health endpoint without authentication for status polling
  if (req.path === '/health') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-bridge-secret'];

  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (customHeader) {
    token = customHeader;
  }

  if (!token || token !== config.bridgeSecret) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing bridge secret authentication token.',
    });
  }

  next();
}

module.exports = authenticate;
