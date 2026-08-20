import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pool from './config/db.js';
import leaveRoutes from './Routes/leaveRoutes.js';
import DashboardRoutes from './Routes/DashboardRoutes.js';
import ReportsRoutes from './Routes/ReportsRoutes.js';

dotenv.config({ quiet: true });

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, 'Frontend');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HR Portal API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/timeoff', leaveRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/reports', ReportsRoutes);

app.use(express.static(frontendRoot));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

app.use((error, req, res, _next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must contain valid JSON.' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large.' });
  }

  console.error('Unhandled request error:', error.message);
  res.status(500).json({ error: 'Internal server error.' });
});

export function startServer(port = process.env.PORT || 3000) {
  const parsedPort = Number(port);
  if (!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
  }

  const server = app.listen(parsedPort, () => {
    console.log(`HR Portal API listening on port ${parsedPort}`);
  });

  server.on('error', (error) => {
    console.error('HTTP server error:', error.message);
    process.exitCode = 1;
  });

  pool.getConnection()
    .then((connection) => {
      connection.release();
      console.log('MySQL database connected successfully.');
    })
    .catch((error) => {
      console.error('Unable to connect to MySQL database:', error.message);
    });

  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const server = startServer();

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down.`);
    server.close(() => {
      pool.end()
        .catch((error) => console.error('Error closing MySQL pool:', error.message))
        .finally(() => process.exit(0));
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}
