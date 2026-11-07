const express = require('express');
const router = express.Router();
const streamController = require('../obs/streamController');

// GET /api/obs/stream/status - Get streaming timecode, bitrate, fps, cpu
router.get('/stream/status', async (req, res) => {
  try {
    const data = await streamController.getStatus();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/obs/stream/start - Start streaming
router.post('/stream/start', async (req, res) => {
  try {
    const data = await streamController.startStream();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/obs/stream/stop - Stop streaming
router.post('/stream/stop', async (req, res) => {
  try {
    const data = await streamController.stopStream();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
