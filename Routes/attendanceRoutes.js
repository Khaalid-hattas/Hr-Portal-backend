const express = require("express");

const router = express.Router();

const attendanceController =
    require("../Controllers/attendanceController");


// =====================================
// GET ALL ATTENDANCE
// =====================================

router.get(
    "/",
    attendanceController.getAttendance
);


// =====================================
// GET EMPLOYEE ATTENDANCE
// =====================================

router.get(
    "/employee/:id",
    attendanceController.getEmployeeAttendance
);


// =====================================
// CREATE ATTENDANCE
// =====================================

router.post(
    "/",
    attendanceController.createAttendance
);


// =====================================
// UPDATE ATTENDANCE
// =====================================

router.put(
    "/:id",
    attendanceController.updateAttendance
);


// =====================================
// DELETE ATTENDANCE
// =====================================

router.delete(
    "/:id",
    attendanceController.deleteAttendance
);


// =====================================
// ATTENDANCE STATISTICS
// =====================================

router.get(
    "/stats",
    attendanceController.getAttendanceStats
);


module.exports = router;