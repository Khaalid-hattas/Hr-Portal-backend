const express = require("express");

const router = express.Router();

const leaveController =
    require("../Controllers/leaveController");


// Get all leave requests
router.get(
    "/",
    leaveController.getLeaveRequests
);


// Get leave requests for one employee
router.get(
    "/employee/:id",
    leaveController.getEmployeeLeaveRequests
);


// Create leave request
router.post(
    "/",
    leaveController.createLeaveRequest
);


// Update leave request
router.put(
    "/:id",
    leaveController.updateLeaveRequest
);


// Delete leave request
router.delete(
    "/:id",
    leaveController.deleteLeaveRequest
);


module.exports = router;