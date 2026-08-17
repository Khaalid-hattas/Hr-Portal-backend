const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test SQL Connection & Sync Database
sequelize.authenticate()
  .then(() => {
    console.log('SQL Database connected successfully.');
    return sequelize.sync(); // Syncs models with DB tables
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });