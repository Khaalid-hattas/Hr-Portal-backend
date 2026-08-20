<<<<<<< HEAD
const express = require('express');
const controller = require('../Controllers/leaveController2.0');

const router = express.Router();
router.get('/', controller.getRequests);
router.patch('/:id', controller.updateRequest);

module.exports = router;
=======
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
>>>>>>> Elijah/backend
