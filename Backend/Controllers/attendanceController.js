import * as attendanceModel from '../models/attendanceModel.js';


// =====================================
// GET ALL ATTENDANCE
// =====================================

const getAttendance = async (req, res) => {

    try {

        const attendance =
            await attendanceModel.getAttendance();

        res.status(200).json(attendance);

    } catch (error) {

        console.error(
            "Error getting attendance:",
            error
        );

        res.status(500).json({

            message: "Error getting attendance",

            error: error.message

        });

    }

};


// =====================================
// GET EMPLOYEE ATTENDANCE
// =====================================

const getEmployeeAttendance = async (req, res) => {

    try {

        const employeeId =
            req.params.id;

        const attendance =
            await attendanceModel.getEmployeeAttendance(
                employeeId
            );

        res.status(200).json(attendance);

    } catch (error) {

        console.error(
            "Error getting employee attendance:",
            error
        );

        res.status(500).json({

            message:
                "Error getting employee attendance",

            error: error.message

        });

    }

};


// =====================================
// CREATE ATTENDANCE
// =====================================

const createAttendance = async (req, res) => {

    try {

        const attendance =
            req.body;

        const result =
            await attendanceModel.createAttendance(
                attendance
            );

        res.status(201).json({

            message:
                "Attendance record created successfully",

            attendanceId:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Error creating attendance:",
            error
        );

        res.status(500).json({

            message:
                "Error creating attendance",

            error:
                error.message

        });

    }

};


// =====================================
// UPDATE ATTENDANCE
// =====================================

const updateAttendance = async (req, res) => {

    try {

        const id =
            req.params.id;

        const attendance =
            req.body;

        const result =
            await attendanceModel.updateAttendance(
                id,
                attendance
            );

        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                message:
                    "Attendance record not found"

            });

        }

        res.status(200).json({

            message:
                "Attendance record updated successfully"

        });

    } catch (error) {

        console.error(
            "Error updating attendance:",
            error
        );

        res.status(500).json({

            message:
                "Error updating attendance",

            error:
                error.message

        });

    }

};


// =====================================
// DELETE ATTENDANCE
// =====================================

const deleteAttendance = async (req, res) => {

    try {

        const id =
            req.params.id;

        const result =
            await attendanceModel.deleteAttendance(
                id
            );

        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                message:
                    "Attendance record not found"

            });

        }

        res.status(200).json({

            message:
                "Attendance record deleted successfully"

        });

    } catch (error) {

        console.error(
            "Error deleting attendance:",
            error
        );

        res.status(500).json({

            message:
                "Error deleting attendance",

            error:
                error.message

        });

    }

};


// =====================================
// ATTENDANCE STATISTICS
// =====================================

const getAttendanceStats = async (req, res) => {

    try {

        const cards =
            await attendanceModel.getAttendanceStats();

        const daily =
            await attendanceModel.getDailyAttendanceStats();

        res.status(200).json({

            cards: cards,

            daily: daily

        });

    } catch (error) {

        console.error(
            "Attendance stats error:",
            error
        );

        res.status(500).json({

            message:
                "Error loading attendance statistics",

            error:
                error.message

        });

    }

};


// =====================================
// EXPORT
// =====================================

export {
    getAttendance,
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceStats
};
