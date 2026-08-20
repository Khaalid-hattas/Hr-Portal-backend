const attendanceModel = require("../models/attendanceModel");
const db = require("../config/db");

// Get all attendance records
const getAttendance = async (req, res) => {
    try {
        const attendance = await attendanceModel.getAttendance();

        res.status(200).json(attendance);

    } catch (error) {
        console.error("Error getting attendance:", error);

        res.status(500).json({
            message: "Error getting attendance",
            error: error.message
        });
    }
};


// Get attendance for one employee
const getEmployeeAttendance = async (req, res) => {
    try {
        const employeeId = req.params.id;

        const attendance = await attendanceModel.getEmployeeAttendance(employeeId);

        res.status(200).json(attendance);

    } catch (error) {
        console.error("Error getting employee attendance:", error);

        res.status(500).json({
            message: "Error getting employee attendance",
            error: error.message
        });
    }
};


// Add an attendance record
const createAttendance = async (req, res) => {
    try {
        const attendance = req.body;

        const result = await attendanceModel.createAttendance(attendance);

        res.status(201).json({
            message: "Attendance record created successfully",
            attendanceId: result.insertId
        });

    } catch (error) {
        console.error("Error creating attendance:", error);

        res.status(500).json({
            message: "Error creating attendance",
            error: error.message
        });
    }
};


// Update an attendance record
const updateAttendance = async (req, res) => {
    try {
        const id = req.params.id;
        const attendance = req.body;

        const result = await attendanceModel.updateAttendance(id, attendance);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            message: "Attendance record updated successfully"
        });

    } catch (error) {
        console.error("Error updating attendance:", error);

        res.status(500).json({
            message: "Error updating attendance",
            error: error.message
        });
    }
};


// Delete an attendance record
const deleteAttendance = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await attendanceModel.deleteAttendance(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            message: "Attendance record deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting attendance:", error);

        res.status(500).json({
            message: "Error deleting attendance",
            error: error.message
        });
    }
};

const getAttendanceStats = async (req, res) => {
    try {
        const cards =
            await attendanceModel.getAttendanceStats();

        const daily =
            await attendanceModel.getDailyAttendanceStats();

        res.json({
            cards,
            daily
        });

    } catch (error) {
        console.error("Attendance stats error:", error);

        res.status(500).json({
            message: "Error loading attendance statistics",
            error: error.message
        });
    }
};


module.exports = {
    getAttendance,
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceStats
};