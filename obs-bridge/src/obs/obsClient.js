const { OBSWebSocket } = require('obs-websocket-js');
const config = require('../config/env');

class OBSClientManager {
  constructor() {
    this.obs = new OBSWebSocket();
    this.isConnected = false;
    this.isConnecting = false;
    this.currentScene = 'LIVE_MATCH';
    this.isStreaming = false;
    this.lastError = null;
    this.reconnectTimer = null;

    this.registerEventHandlers();
  }

  registerEventHandlers() {
    this.obs.on('CurrentProgramSceneChanged', (data) => {
      this.currentScene = data.sceneName;
      console.log(`[OBS Event] Scene changed to: ${data.sceneName}`);
    });

    this.obs.on('StreamStateChanged', (data) => {
      this.isStreaming = data.outputActive;
      console.log(`[OBS Event] Stream active: ${data.outputActive}`);
    });

    this.obs.on('ConnectionClosed', (error) => {
      this.isConnected = false;
      this.lastError = 'Connection closed by OBS Studio';
      console.warn('[OBS] Disconnected from OBS Studio. Will attempt reconnect in 5s...');
      this.scheduleReconnect();
    });

    this.obs.on('ConnectionError', (err) => {
      this.isConnected = false;
      this.lastError = err?.message || 'Connection error';
      console.error('[OBS] Connection error:', this.lastError);
    });
  }

  async connect() {
    if (this.isConnected || this.isConnecting) return;

    this.isConnecting = true;
    
    // Support auto-detecting between configured port, 4457, and 4455
    const candidatePorts = Array.from(new Set([config.obsPort, 4457, 4455]));
    let connectedSuccess = false;

    for (const port of candidatePorts) {
      const url = `ws://${config.obsHost}:${port}`;
      try {
        console.log(`[OBS] Connecting to OBS Studio at ${url}...`);
        await this.obs.connect(url, config.obsPassword || undefined);

        this.isConnected = true;
        this.isConnecting = false;
        this.lastError = null;
        this.activePort = port;
        connectedSuccess = true;
        console.log(`[OBS] Successfully connected to OBS Studio WebSocket on port ${port}!`);

        // Fetch initial state
        try {
          const sceneInfo = await this.obs.call('GetCurrentProgramScene');
          this.currentScene = sceneInfo.currentProgramSceneName;

          const streamStatus = await this.obs.call('GetStreamStatus');
          this.isStreaming = streamStatus.outputActive;
        } catch (stateErr) {
          console.warn('[OBS] Warning fetching initial state:', stateErr.message);
        }
        break;
      } catch (err) {
        // If password is wrong or other non-connection error, don't try other ports
        if (err.message && err.message.includes('Authentication failed')) {
          this.lastError = 'OBS Authentication failed: Incorrect WebSocket password.';
          break;
        }
      }
    }

    if (!connectedSuccess) {
      this.isConnected = false;
      this.isConnecting = false;
      if (!this.lastError) {
        this.lastError = 'Failed to connect to OBS Studio (tested ports: ' + candidatePorts.join(', ') + ')';
      }
      console.warn(`[OBS] Connection attempt failed: ${this.lastError}`);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 5000);
  }

  async disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.isConnected) {
      await this.obs.disconnect();
      this.isConnected = false;
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
      currentScene: this.currentScene,
      isStreaming: this.isStreaming,
      host: config.obsHost,
      port: config.obsPort,
      lastError: this.lastError,
    };
  }
}

// Singleton instance
const obsClient = new OBSClientManager();
module.exports = obsClient;
