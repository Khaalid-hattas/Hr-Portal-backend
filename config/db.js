require('dotenv').config();
const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3307', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'moderntech_hr',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
