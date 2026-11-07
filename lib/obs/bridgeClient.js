// Client-side helper for interacting with the local OBS Bridge companion service

class OBSBridgeClient {
  constructor() {
    this.bridgeUrl = process.env.NEXT_PUBLIC_OBS_BRIDGE_URL || 'http://localhost:4000';
    this.secret = process.env.NEXT_PUBLIC_OBS_BRIDGE_SECRET || 'broadcaster-secure-secret-2025';

    // In browser, load user-configured values from localStorage
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('obs_bridge_url');
      const savedSecret = localStorage.getItem('obs_bridge_secret');
      if (savedUrl) this.bridgeUrl = savedUrl;
      if (savedSecret) this.secret = savedSecret;
    }
  }

  getBridgeUrl() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('obs_bridge_url') || this.bridgeUrl;
    }
    return this.bridgeUrl;
  }

  setBridgeUrl(url) {
    this.bridgeUrl = url;
    if (typeof window !== 'undefined') {
      localStorage.setItem('obs_bridge_url', url);
      window.dispatchEvent(new CustomEvent('obs_bridge_settings_changed', { detail: { url } }));
    }
  }

  setSecret(secret) {
    this.secret = secret;
    if (typeof window !== 'undefined') {
      localStorage.setItem('obs_bridge_secret', secret);
    }
  }

  getHeaders() {
    const activeSecret = typeof window !== 'undefined'
      ? localStorage.getItem('obs_bridge_secret') || this.secret
      : this.secret;

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${activeSecret}`,
      'x-bridge-secret': activeSecret,
    };
  }

  async getHealth() {
    let url = this.getBridgeUrl();
    try {
      const res = await fetch(`${url}/health`, { method: 'GET' });
      if (!res.ok) throw new Error(`Bridge returned HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      // Auto-fallback from port 4000 to 4001 if port 4000 was blocked by Windows
      if (url.includes(':4000')) {
        const altUrl = url.replace(':4000', ':4001');
        try {
          const res2 = await fetch(`${altUrl}/health`, { method: 'GET' });
          if (res2.ok) {
            this.setBridgeUrl(altUrl);
            return await res2.json();
          }
        } catch (e) {
          // fallback failed
        }
      }

      return {
        status: 'error',
        bridge: 'offline',
        obsConnected: false,
        error: err.message,
      };
    }
  }

  async getStatus() {
    const url = this.getBridgeUrl();
    const res = await fetch(`${url}/api/obs/status`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.json()).error || 'Failed to fetch OBS status'}`);
    return await res.json();
  }

  async getScenes() {
    const url = this.getBridgeUrl();
    const res = await fetch(`${url}/api/obs/scenes`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch scenes');
    return data.data;
  }

  async switchScene(sceneName) {
    const url = this.getBridgeUrl();
    const res = await fetch(`${url}/api/obs/scenes/switch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sceneName }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to switch scene');
    return data.data;
  }

  async getSources(sceneName) {
    const url = this.getBridgeUrl();
    const query = sceneName ? `?sceneName=${encodeURIComponent(sceneName)}` : '';
    const res = await fetch(`${url}/api/obs/sources${query}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch sources');
    return data.data;
  }

  async setSourceVisibility(sceneName, sceneItemId, enabled) {
    const url = this.getBridgeUrl();
    const res = await fetch(`${url}/api/obs/sources/visibility`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ sceneName, sceneItemId, enabled }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to set source visibility');
    return data.data;
  }

  async getStreamStatus() {
    const url = this.getBridgeUrl();
    const res = await fetch(`${url}/api/obs/stream/status`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to get stream status');
    return data.data;
  }

  async startStream() {
    const url = this.getBridgeUrl();
    const res = await fetch(`${url}/api/obs/stream/start`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to start stream');
    return data.data;
  }

  async stopStream() {
    const url = this.getBridgeUrl();
    const res = await fetch(`${url}/api/obs/stream/stop`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Failed to stop stream');
    return data.data;
  }
}

export const obsBridgeClient = new OBSBridgeClient();
