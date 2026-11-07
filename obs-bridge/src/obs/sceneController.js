const obsClient = require('./obsClient');

class SceneController {
  async getScenes() {
    if (!obsClient.isConnected) {
      throw new Error('OBS Studio is not connected. Ensure OBS is running with WebSocket enabled on port 4455.');
    }

    const response = await obsClient.obs.call('GetSceneList');
    return {
      currentScene: response.currentProgramSceneName,
      scenes: response.scenes.map((s) => ({
        name: s.sceneName,
        index: s.sceneIndex,
      })),
    };
  }

  async switchScene(sceneName) {
    if (!obsClient.isConnected) {
      throw new Error('OBS Studio is not connected.');
    }

    if (!sceneName || typeof sceneName !== 'string') {
      throw new Error('Scene name is required.');
    }

    await obsClient.obs.call('SetCurrentProgramScene', {
      sceneName,
    });

    obsClient.currentScene = sceneName;
    return {
      success: true,
      currentScene: sceneName,
    };
  }
}

module.exports = new SceneController();
