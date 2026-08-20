import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Database configurations
import pool from '../config/db.js';
import { db } from './config/payroll_config.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import employeeRoutes from './routes/employees.js';
import employeesRouter from './routes/employeesRouter.js';
import payrollRouter from './routes/payrollRouter.js';
import dashboardRoutes from './routes/DashboardRoutes.js';
import reportsRoutes from './routes/ReportsRoutes.js';

dotenv.config({ quiet: true });

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, 'Frontend');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HR Portal & Payroll API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/employees', employeesRouter); // From payroll server block
app.use('/payroll', payrollRouter);     // From payroll server block
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);

// Static Frontend Delivery
app.use(express.static(frontendRoot));
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

// 404 Fallback Handler
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found! Oh no! Don't worry we will fix it ;)" });
});

// Global Error Handler
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

// Server Initialization
export function startServer(port = process.env.PORT || 3000) {
  const parsedPort = Number(port);
  if (!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
    throw new Error('PORT must be an integer between 0 and 65535.');
  }

  const server = app.listen(parsedPort, () => {
    console.log(`ModernTech HR & Payroll API listening on port ${parsedPort}`);
  });

  server.on('error', (error) => {
    console.error('HTTP server error:', error.message);
    process.exitCode = 1;
  });

  // DB Connection Validation
  if (pool && pool.getConnection) {
    pool.getConnection()
      .then((connection) => {
        connection.release();
        console.log('MySQL database connected successfully.');
      })
      .catch((error) => {
        console.error('Unable to connect to MySQL database:', error.message);
      });
  }

  return server;
}

// Execute if run directly
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const server = startServer();

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down.`);
    server.close(() => {
      if (pool && pool.end) {
        pool.end()
          .catch((error) => console.error('Error closing MySQL pool:', error.message))
          .finally(() => process.exit(0));
      } else {
        process.exit(0);
      }
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}
