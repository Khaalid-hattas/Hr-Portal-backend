const leaveModel = require("../models/leaveModel");


// Get all leave requests
const getLeaveRequests = async (req, res) => {

    try {

        const leaveRequests =
            await leaveModel.getLeaveRequests();

        res.status(200).json(leaveRequests);

    } catch (error) {

        console.error("Error getting leave requests:", error);

        res.status(500).json({
            message: "Error getting leave requests",
            error: error.message
        });
    }
};


// Get leave requests for one employee
const getEmployeeLeaveRequests = async (req, res) => {

    try {

        const employeeId = req.params.id;

        const leaveRequests =
            await leaveModel.getEmployeeLeaveRequests(employeeId);

        res.status(200).json(leaveRequests);

    } catch (error) {

        console.error(
            "Error getting employee leave requests:",
            error
        );

        res.status(500).json({
            message: "Error getting employee leave requests",
            error: error.message
        });
    }
};


// Create leave request
const createLeaveRequest = async (req, res) => {

    try {

        const leave = req.body;

        const result =
            await leaveModel.createLeaveRequest(leave);

        res.status(201).json({
            message: "Leave request created successfully",
            leaveId: result.insertId
        });

    } catch (error) {

        console.error("Error creating leave request:", error);

        res.status(500).json({
            message: "Error creating leave request",
            error: error.message
        });
    }
};


// Update leave request
const updateLeaveRequest = async (req, res) => {

    try {

        const id = req.params.id;
        const leave = req.body;

        const result =
            await leaveModel.updateLeaveRequest(id, leave);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave request updated successfully"
        });

    } catch (error) {

        console.error("Error updating leave request:", error);

        res.status(500).json({
            message: "Error updating leave request",
            error: error.message
        });
    }
};


// Delete leave request
const deleteLeaveRequest = async (req, res) => {

    try {

        const id = req.params.id;

        const result =
            await leaveModel.deleteLeaveRequest(id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            message: "Leave request deleted successfully"
        });

    } catch (error) {

        console.error("Error deleting leave request:", error);

        res.status(200).json({
            message: "Leave request deleted successfully"
        });
    }
};


module.exports = {
    getLeaveRequests,
    getEmployeeLeaveRequests,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest
};
