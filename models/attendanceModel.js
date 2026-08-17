const db = require("../config/db");


// Get all attendance records
const getAttendance = async () => {
    const [rows] = await db.query(
        "SELECT * FROM attendance"
    );

    return rows;
};


// Get attendance for one employee
const getEmployeeAttendance = async (employeeId) => {
    const [rows] = await db.query(
        "SELECT * FROM attendance WHERE employee_id = ?",
        [employeeId]
    );

    return rows;
};


// Add an attendance record
const createAttendance = async (attendance) => {

    const {
        employee_id,
        employee_name,
        date,
        status,
        check_in,
        check_out
    } = attendance;

    const [result] = await db.query(
        `INSERT INTO attendance
        (employee_id, employee_name, date, status, check_in, check_out)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            employee_id,
            employee_name,
            date,
            status,
            check_in,
            check_out
        ]
    );

    return result;
};


// Update an attendance record
const updateAttendance = async (id, attendance) => {

    const {
        employee_id,
        employee_name,
        date,
        status,
        check_in,
        check_out
    } = attendance;

    const [result] = await db.query(
        `UPDATE attendance
        SET employee_id = ?,
            employee_name = ?,
            date = ?,
            status = ?,
            check_in = ?,
            check_out = ?
        WHERE id = ?`,
        [
            employee_id,
            employee_name,
            date,
            status,
            check_in,
            check_out,
            id
        ]
    );

    return result;
};


// Delete an attendance record
const deleteAttendance = async (id) => {

    const [result] = await db.query(
        "DELETE FROM attendance WHERE id = ?",
        [id]
    );

    return result;
};


// Export all model functions
module.exports = {
    getAttendance,
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
};