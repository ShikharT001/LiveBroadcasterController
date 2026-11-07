const express = require('express');
const cors = require('cors');
const os = require('os');
const config = require('./config/env');
const obsClient = require('./obs/obsClient');
const authenticate = require('./middleware/authenticate');

const healthRoutes = require('./routes/health');
const scenesRoutes = require('./routes/scenes');
const sourcesRoutes = require('./routes/sources');
const streamRoutes = require('./routes/stream');

const app = express();

// Helper to get local network IP addresses
function getNetworkAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

// Middleware: Permissive CORS for local LAN & multi-device dashboard access
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Public health check route
app.use('/', healthRoutes);

// Protected OBS API routes
app.use('/api/obs', authenticate);
app.use('/api/obs', scenesRoutes);
app.use('/api/obs', sourcesRoutes);
app.use('/api/obs', streamRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[OBS Bridge Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal bridge error' });
});

// Function to start server with automatic port fallback if port is reserved on Windows
function startServer(port) {
  const server = app.listen(port, config.host, () => {
    const lanIps = getNetworkAddresses();
    console.log(`====================================================`);
    console.log(`  OBS Bridge Service Active on Port ${port}`);
    console.log(`  - Local PC:     http://127.0.0.1:${port}`);
    if (lanIps.length > 0) {
      lanIps.forEach((ip) => {
        console.log(`  - 2ND SYSTEM:   http://${ip}:${port}`);
      });
    }
    console.log(`  - Target OBS:   ws://${config.obsHost}:${config.obsPort}`);
    console.log(`====================================================`);

    // Attempt initial connection to OBS Studio
    obsClient.connect();
  });

  server.on('error', (err) => {
    if ((err.code === 'EADDRINUSE' || err.code === 'EACCES') && port === 4000) {
      console.warn(`[Port 4000 In Use or Reserved by Windows] Automatically falling back to port 4001...`);
      startServer(4001);
    } else {
      console.error('[OBS Bridge Server Error]', err);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down OBS Bridge...');
    await obsClient.disconnect();
    server.close(() => {
      console.log('OBS Bridge stopped.');
      process.exit(0);
    });
  });
}

startServer(config.port);
