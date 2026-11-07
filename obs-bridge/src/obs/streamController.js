const obsClient = require('./obsClient');

class StreamController {
  async getStatus() {
    if (!obsClient.isConnected) {
      return {
        isStreaming: false,
        duration: 0,
        bytes: 0,
        fps: 0,
        cpu: 0,
        connected: false,
      };
    }

    try {
      const status = await obsClient.obs.call('GetStreamStatus');
      const stats = await obsClient.obs.call('GetStats');

      obsClient.isStreaming = status.outputActive;

      return {
        connected: true,
        isStreaming: status.outputActive,
        timecode: status.outputTimecode || '00:00:00',
        duration: status.outputDuration || 0,
        bytes: status.outputBytes || 0,
        fps: Math.round(stats.activeFps || 0),
        cpu: stats.cpuUsage ? stats.cpuUsage.toFixed(1) : 0,
        memory: stats.memoryUsage ? stats.memoryUsage.toFixed(1) : 0,
        kbitsPerSec: status.outputKbitsPerSec || 0,
      };
    } catch (err) {
      return {
        connected: true,
        isStreaming: obsClient.isStreaming,
        error: err.message,
      };
    }
  }

  async startStream() {
    if (!obsClient.isConnected) {
      throw new Error('OBS Studio is not connected.');
    }

    await obsClient.obs.call('StartStream');
    obsClient.isStreaming = true;
    return { success: true, isStreaming: true };
  }

  async stopStream() {
    if (!obsClient.isConnected) {
      throw new Error('OBS Studio is not connected.');
    }

    await obsClient.obs.call('StopStream');
    obsClient.isStreaming = false;
    return { success: true, isStreaming: false };
  }
}

module.exports = new StreamController();
