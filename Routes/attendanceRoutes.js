const express = require("express");

const router = express.Router();

const attendanceController =
    require("../Controllers/attendanceController");


// Get all attendance
router.get(
    "/",
    attendanceController.getAttendance
);


// Get attendance for one employee
router.get(
    "/employee/:id",
    attendanceController.getEmployeeAttendance
);


// Create attendance
router.post(
    "/",
    attendanceController.createAttendance
);


// Update attendance
router.put(
    "/:id",
    attendanceController.updateAttendance
);


// Delete attendance
router.delete(
    "/:id",
    attendanceController.deleteAttendance
);


// Attendance statistics
router.get(
    "/stats",
    attendanceController.getAttendanceStats
);


module.exports = router;