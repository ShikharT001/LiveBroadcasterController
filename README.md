# Live Sports Broadcast Controller & OBS Studio Integration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FShikharT001%2FLiveBroadcasterController)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/ShikharT001/LiveBroadcasterController)

A professional, full-featured **Next.js Broadcast Controller** built for live sports broadcasts (initial focus: **Volleyball**). It empowers broadcast operators to manage live match scores, trigger automated on-screen broadcast graphics (scoreboards, player spotlights, sponsor banners, set summaries, victory celebrations), switch OBS scenes, and manage YouTube Live streaming directly from a centralized web-based dashboard.

```
             NEXT.JS ADMIN DASHBOARD
                       |
          ----------------------------
          |             |            |
      Score Control  Graphics     OBS Control
          |             |            |
          ----------------------------
                       |
                 SUPABASE
             PostgreSQL + Realtime
                       |
              NEXT.JS OVERLAY (1920x1080)
                       |
                OBS BROWSER SOURCE
                       |
                 OBS STUDIO (Local)
                       |
             YouTube Live Streaming
```

---

## Key Features

1. **Volleyball Match Scoring Engine**
   - Live score management (+1 point, -1 correction) with automatic serve rotation.
   - Set management (Sets 1–4 to 25 pts with 2-point lead rule; 5th set tiebreak to 15 pts).
   - Timeout counters (up to 2 timeouts per set per team).
   - Point-by-point audit log with instant "Undo Point" capability.
   - Start, pause, and conclude match controls with confirmation dialogs.

2. **1920×1080 Public Broadcast Overlay (`/overlay/[matchId]`)**
   - Transparent canvas designed for OBS Studio Browser Source.
   - Real-time updates via Supabase Realtime & local BroadcastChannel (zero-reload updates).
   - Modular graphics:
     - **Scoreboard Bar**: Team short codes, colors, active serving dot, sets won tally.
     - **Player Spotlight Lower-Third**: Player photo/silhouette, jersey number, court position, live stats.
     - **Sponsor Commercial Banner**: Sponsor branding, logo, promotional tagline.
     - **Set Results Card**: Complete set-by-set breakdown highlighting set winners.
     - **Match Winner Celebration**: Championship trophy card with final set scores.
     - **Custom Lower-Third Announcement**: Breaking match notices, injury updates, referee challenge announcements.

3. **Secure OBS Studio Bridge (`obs-bridge/`)**
   - Lightweight Node.js companion service running locally on the broadcasting machine.
   - Communicates with OBS Studio via `obs-websocket-js` on port `4455`.
   - Never exposes OBS WebSocket credentials to browser JavaScript.
   - Authenticated via secret bearer token (`BRIDGE_SECRET`).
   - Auto-reconnects to OBS Studio if OBS restarts.

4. **Dedicated OBS Studio Dashboard**
   - Active scene switcher (`LIVE_MATCH`, `PLAYER_INTRO`, `SPONSOR_BREAK`, `SET_RESULTS`, `MATCH_WINNER`).
   - Source visibility toggles (camera feeds, ambient audio, overlays).
   - YouTube Live streaming controls with confirmation protection.
   - Real-time stream telemetry: FPS, CPU usage, duration timecode, bitrate.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | Next.js App Router | Strict JavaScript (`.js`/`.jsx` only, zero TypeScript) |
| **Styling** | Tailwind CSS | Dark broadcast-operator aesthetic (`#080C14`, `#0F172A`) |
| **UI Primitives** | Custom UI (shadcn style) | Buttons, Cards, Dialogs, Badges, Tabs, Inputs |
| **Icons** | Lucide React | Modern broadcast icons |
| **Database** | Supabase PostgreSQL | 12 tables, indexes, and Row Level Security (RLS) |
| **Realtime** | Supabase Realtime | WebSockets for sub-second graphic updates |
| **Validation** | Zod | Client and server data validation schemas |
| **OBS Bridge** | Node.js + Express | Isolated local companion service |
| **OBS Protocol** | `obs-websocket-js` v5 | Native WebSocket RPC client for OBS Studio |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v20+)
- **OBS Studio** v28+ (download from [obsproject.com](https://obsproject.com/))
- **Supabase Account** (optional for local testing; demo bypass is included)

---

### 2. Next.js Broadcast Controller Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *(If you haven't set up Supabase yet, default demo values are already populated)*

3. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the Operator Console.

---

### 3. Local OBS Bridge Companion Setup

The OBS Bridge runs locally on the broadcasting computer to talk to OBS Studio.

1. **Navigate to the bridge folder and install dependencies:**
   ```bash
   cd obs-bridge
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your OBS WebSocket password:
   ```env
   PORT=4000
   OBS_HOST=127.0.0.1
   OBS_PORT=4455
   OBS_PASSWORD=your_obs_password
   BRIDGE_SECRET=broadcaster-secure-secret-2025
   ```

3. **Start the bridge:**
   ```bash
   npm run dev
   ```
   Health check endpoint: [http://localhost:4000/health](http://localhost:4000/health)

---

## 📹 Essential OBS Studio Setup Guide

Follow these 9 steps to configure OBS Studio for broadcast:

### Step 1 — Install OBS Studio
1. Download OBS Studio from [obsproject.com](https://obsproject.com/).
2. Install it on the computer used for broadcasting.
3. Open OBS Studio.
4. Set base canvas and output resolution to **1920 × 1080**.
5. Configure 60 FPS (or 30 FPS depending on camera feed).

### Step 2 — Enable OBS WebSocket Server
1. In OBS Studio, open **Tools &rarr; WebSocket Server Settings**.
2. Check **Enable WebSocket server**.
3. Set Server Port to `4455`.
4. Check **Enable Authentication**.
5. Generate or set a strong **Server Password**.
6. Copy this password into `obs-bridge/.env` as `OBS_PASSWORD`.
7. Click **Apply** and **OK**.

### Step 3 — Create OBS Scenes
In the OBS Scenes panel, create the following 5 scenes:
```text
LIVE_MATCH
PLAYER_INTRO
SPONSOR_BREAK
SET_RESULTS
MATCH_WINNER
```

### Step 4 — Add Match Video Feed
1. Select the `LIVE_MATCH` scene.
2. In the **Sources** panel, click `+` and choose your video source:
   - **Video Capture Device** (for HDMI capture card or webcam).
   - **Media Source** (for pre-recorded match video).
3. Transform &rarr; **Fit to Screen** (1920×1080).

### Step 5 — Add the Next.js Broadcast Overlay
1. Ensure the Next.js app is running (`http://localhost:3000`).
2. Select the `LIVE_MATCH` scene in OBS.
3. In Sources, click `+` and select **Browser**.
4. Name it `NextJS Broadcast Overlay`.
5. Set URL to:
   ```text
   http://localhost:3000/overlay/volleyball-match-1
   ```
6. Set **Width**: `1920`.
7. Set **Height**: `1080`.
8. Uncheck "Shutdown source when not visible".
9. Ensure the overlay source is positioned **above** the match video in the Sources list.
*(The overlay has a 100% transparent background, so court video shows underneath)*.

### Step 6 — Run the Local OBS Bridge
1. Start the companion bridge:
   ```bash
   cd obs-bridge
   npm run dev
   ```
2. Verify that console reports: `Successfully connected to OBS Studio WebSocket!`.

### Step 7 — Connect the Next.js Controller
1. Open the Controller Dashboard at [http://localhost:3000](http://localhost:3000).
2. Look at the top status bar:
   - `Bridge: ONLINE`
   - `OBS: CONNECTED`
   - `Scene: LIVE_MATCH`
3. Click **OBS Studio** in the navigation bar to test switching scenes.

### Step 8 — Test Live Broadcast Graphics
1. Navigate to **Graphics Control** in the dashboard.
2. Click **Player Intro** &rarr; Select player &rarr; **Trigger Player Card**.
3. Confirm that the lower-third animates onto the OBS canvas immediately without reloading.
4. Click **Reset to Scoreboard** to return to standard gameplay.
5. In **Match Control**, add points and verify the scoreboard updates synchronously.

### Step 9 — Configure YouTube Live Streaming
1. Open YouTube Studio &rarr; **Go Live**.
2. Copy your **Stream Key**.
3. In OBS Studio, open **Settings &rarr; Stream**.
4. Service: **YouTube - RTMPS**.
5. Paste your Stream Key and click **OK**.
6. From the Next.js OBS Control panel, click **Start Streaming** (with confirmation) to go live!

---

## 🗄️ Database Setup (Supabase)

The project includes production-ready PostgreSQL migrations in `supabase/migrations/`:

- `001_initial_schema.sql`: 12 core tables:
  - `profiles`, `teams`, `players`, `matches`, `match_sets`, `score_events`, `sponsors`, `broadcast_graphic_states`, `broadcast_designs`, `broadcasts`, `match_operators`, `audit_logs`.
  - Indexes and Realtime publication.
- `002_rls_policies.sql`: Complete Row Level Security policies allowing public read for OBS Browser Sources and authenticated writes for broadcast operators.

To apply:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** &rarr; paste and run `001_initial_schema.sql` and `002_rls_policies.sql`.
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.

---

## 🧪 Testing Checklist

- [x] Next.js builds cleanly with zero errors (`npm run build`).
- [x] OBS Bridge connects to OBS Studio WebSocket v5 on port 4455.
- [x] Scene switching commands (`LIVE_MATCH`, `PLAYER_INTRO`, `SPONSOR_BREAK`, `SET_RESULTS`, `MATCH_WINNER`) execute properly.
- [x] Source visibility toggles work for scene items.
- [x] Public overlay (`/overlay/[matchId]`) renders at 1920×1080 with transparent background.
- [x] Volleyball scoring logic handles 25-point sets, 2-point lead rule, timeouts, and set completions.
- [x] Undo Point immediately rolls back incorrect scores in the audit ledger.
- [x] Double-confirmation modals guard critical actions (stopping stream, completing match).

---

## 📄 License
MIT License. Created for professional live sports streaming production.
