const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Elijah_67",
    database: "attendance",
    port: 3307
});

module.exports = db;