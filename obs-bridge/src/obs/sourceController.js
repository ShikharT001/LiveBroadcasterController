const obsClient = require('./obsClient');

class SourceController {
  async getSources(sceneName) {
    if (!obsClient.isConnected) {
      throw new Error('OBS Studio is not connected.');
    }

    const targetScene = sceneName || obsClient.currentScene;
    const response = await obsClient.obs.call('GetSceneItemList', {
      sceneName: targetScene,
    });

    return {
      sceneName: targetScene,
      sources: response.sceneItems.map((item) => ({
        id: item.sceneItemId,
        name: item.sourceName,
        type: item.inputKind || item.sourceType,
        enabled: item.sceneItemEnabled,
      })),
    };
  }

  async setSourceVisibility(sceneName, sceneItemId, enabled) {
    if (!obsClient.isConnected) {
      throw new Error('OBS Studio is not connected.');
    }

    const targetScene = sceneName || obsClient.currentScene;

    await obsClient.obs.call('SetSceneItemEnabled', {
      sceneName: targetScene,
      sceneItemId: parseInt(sceneItemId, 10),
      sceneItemEnabled: Boolean(enabled),
    });

    return {
      success: true,
      sceneName: targetScene,
      sceneItemId,
      enabled: Boolean(enabled),
    };
  }
}

module.exports = new SourceController();
