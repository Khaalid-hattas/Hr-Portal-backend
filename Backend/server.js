import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import pool from './config/database.js';
import DashboardRoutes from './routes/DashboardRoutes.js';
import ReportsRoutes from './routes/ReportsRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '../Frontend/Frontend');

app.use(cors());
app.use(express.json());

const API_BASE = '/api';

app.get('/api', (req, res) => {
  res.json({
    message: 'HR Portal API is running',
    endpoints: [
      '/api/health',
      '/api/dashboard/stats',
      '/api/reports'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HR Portal API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/dashboard', DashboardRoutes);
app.use('/api/reports', ReportsRoutes);
app.use('/api/leave', leaveRoutes);

app.use(express.static(frontendRoot));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

const PORT = process.env.PORT || 3000;

pool.getConnection()
  .then((connection) => {
    console.log('MySQL Database connected successfully.');
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API ready: http://localhost:${PORT}${API_BASE}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    console.log(`Starting API without DB connection on port ${PORT}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API ready: http://localhost:${PORT}${API_BASE}`);
    });
  });
