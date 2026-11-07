const express = require('express');
const router = express.Router();
const obsClient = require('../obs/obsClient');

// Public health check for quick ping / dashboard telemetry
router.get('/health', (req, res) => {
  const status = obsClient.getStatus();
  res.json({
    status: 'ok',
    bridge: 'online',
    timestamp: new Date().toISOString(),
    obsConnected: status.connected,
    currentScene: status.currentScene,
    isStreaming: status.isStreaming,
    lastError: status.lastError,
  });
});

// Authenticated detailed status
router.get('/api/obs/status', (req, res) => {
  res.json({
    success: true,
    data: obsClient.getStatus(),
  });
});

module.exports = router;
