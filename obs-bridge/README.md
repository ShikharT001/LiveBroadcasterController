# Local OBS Bridge Companion Service

This lightweight companion service runs on the broadcasting computer and securely bridges the **Next.js Broadcast Controller** to **OBS Studio (v28+)** via the OBS WebSocket protocol.

## Why is this bridge needed?

When the Next.js controller runs in a remote browser or hosted environment (e.g. Vercel), it cannot establish a direct WebSocket connection to a user's private local network port (`127.0.0.1:4455`). Furthermore, browser JavaScript should **never** be exposed to your secret OBS Studio WebSocket password.

The bridge:
1. Runs locally at `http://127.0.0.1:4000`.
2. Keeps your OBS WebSocket password safe in a local `.env` file.
3. Authenticates commands from the Next.js Controller using a secret bearer token (`BRIDGE_SECRET`).
4. Reconnects to OBS Studio automatically if the broadcast computer restarts or OBS closes.

---

## Quick Setup

### 1. Install Dependencies
```bash
cd obs-bridge
npm install
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your OBS WebSocket credentials:
```env
PORT=4000
OBS_HOST=127.0.0.1
OBS_PORT=4455
OBS_PASSWORD=your_obs_websocket_password_from_tools_menu
BRIDGE_SECRET=broadcaster-secure-secret-2025
ALLOWED_ORIGINS=http://localhost:3000
```

### 3. Start the Bridge
```bash
npm run dev
```

### 4. Health Check
Open `http://localhost:4000/health` in your browser. You should receive:
```json
{
  "status": "ok",
  "bridge": "online",
  "obsConnected": true,
  "currentScene": "LIVE_MATCH",
  "isStreaming": false
}
```
