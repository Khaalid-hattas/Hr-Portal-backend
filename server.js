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
const authRoutes = require("./Routes/authRoutes");
app.use("/api/auth", authRoutes);

// Attendance routes
const attendanceRoutes = require("./Routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);

// Leave routes
const leaveRoutes = require("./Routes/leaveRoutes");
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