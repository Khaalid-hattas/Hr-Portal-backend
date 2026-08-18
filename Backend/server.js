import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import pool from './config/database.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test MySQL Pool Connection & Start Server
pool.getConnection()
  .then((connection) => {
    console.log('MySQL Database connected successfully.');
    connection.release(); // Release the connection back to the pool

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  