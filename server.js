require('dotenv').config();
const express = require('express');
const cors = require('cors');
const leaveRoutes = require('./Backend/routes/leaveRoutes2.0');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/timeoff', leaveRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node + SQL server running on http://localhost:${PORT}`));
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
const authRoutes = require("./Backend/routes/authRoutes");
app.use("/api/auth", authRoutes);

// Attendance routes
const attendanceRoutes = require("./Backend/routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);

// Leave routes
const leaveRoutes = require("./Backend/routes/leaveRoutes2.0");
app.use("/api/leave", leaveRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "HR Portal API is running"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
