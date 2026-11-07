const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  host: process.env.HOST || '0.0.0.0', // Listen on all network interfaces for multi-device/LAN access
  obsHost: process.env.OBS_HOST || '127.0.0.1',
  obsPort: parseInt(process.env.OBS_PORT || '4455', 10),
  obsPassword: process.env.OBS_PASSWORD || '',
  bridgeSecret: process.env.BRIDGE_SECRET || 'broadcaster-secure-secret-2025',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map((o) => o.trim()),
};

module.exports = config;
