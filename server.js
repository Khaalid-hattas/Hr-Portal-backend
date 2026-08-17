const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;


// Middleware
app.use(cors());
app.use(express.json());


// Attendance routes
const attendanceRoutes = require("./Routes/attendanceRoutes");

app.use("/api/attendance", attendanceRoutes);

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