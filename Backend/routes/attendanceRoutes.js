import express from 'express';

const router = express.Router();

import * as attendanceController from '../Controllers/attendanceController.js';


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


export default router;
