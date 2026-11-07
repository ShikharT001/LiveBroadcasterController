const express = require('express');
const router = express.Router();
const sourceController = require('../obs/sourceController');

// GET /api/obs/sources - List sources inside a scene
router.get('/sources', async (req, res) => {
  const { sceneName } = req.query;
  try {
    const data = await sourceController.getSources(sceneName);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/obs/sources/visibility - Toggle visibility of a source in a scene
router.post('/sources/visibility', async (req, res) => {
  const { sceneName, sceneItemId, enabled } = req.body;
  if (sceneItemId === undefined || enabled === undefined) {
    return res.status(400).json({
      success: false,
      error: 'sceneItemId and enabled (boolean) are required in request body.',
    });
  }

  try {
    const data = await sourceController.setSourceVisibility(sceneName, sceneItemId, enabled);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
