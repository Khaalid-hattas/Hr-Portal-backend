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

const getAttendanceStats = async () => {
    const [rows] = await db.query(`
        SELECT
            ROUND(AVG(present_count), 1) AS avgPresent,
            ROUND(AVG(absent_count), 1) AS avgAbsent,
            SUM(late_count) AS lateArrivals
        FROM (
            SELECT
                date,

                SUM(status = 'Present') AS present_count,

                SUM(status = 'Absent') AS absent_count,

                SUM(status = 'Late') AS late_count

            FROM attendance
            GROUP BY date
        ) AS daily_stats
    `);

    return rows[0];
};

const getDailyAttendanceStats = async () => {
    const [rows] = await db.query(`
        SELECT
            DATE_FORMAT(date, '%a %b %d') AS date,

            SUM(status = 'Present') AS present,

            SUM(status = 'Absent') AS absent,

            SUM(status = 'Late') AS late

        FROM attendance

        GROUP BY date

        ORDER BY date
    `);

    return rows;
};


// Export all model functions
module.exports = {
    getDailyAttendanceStats,
    getAttendanceStats,
    getAttendance,
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
};