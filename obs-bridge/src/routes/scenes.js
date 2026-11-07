const express = require('express');
const router = express.Router();
const sceneController = require('../obs/sceneController');

// GET /api/obs/scenes - List all scenes in OBS Studio
router.get('/scenes', async (req, res) => {
  try {
    const data = await sceneController.getScenes();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/obs/scenes/switch - Switch program scene in OBS Studio
router.post('/scenes/switch', async (req, res) => {
  const { sceneName } = req.body;
  if (!sceneName) {
    return res.status(400).json({ success: false, error: 'sceneName is required in request body.' });
  }

  try {
    const data = await sceneController.switchScene(sceneName);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
