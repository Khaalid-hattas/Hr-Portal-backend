<<<<<<< HEAD
const db = require('../../config/db');

async function findAll() {
    const [rows] = await db.query(`
        SELECT t.request_id, t.employee_id,
               COALESCE(e.name, CONCAT('Employee #', t.employee_id)) AS employee_name,
               COALESCE(e.department, '') AS department,
               t.leave_type, t.start_date, t.end_date, t.reason, t.status
        FROM time_off_requests t
        LEFT JOIN employees e ON e.employee_id = t.employee_id
        ORDER BY t.request_id DESC
    `);
    return rows;
}

async function updateStatus(id, status) {
    return db.query('UPDATE time_off_requests SET status = ? WHERE request_id = ?', [status, id]);
}

module.exports = { findAll, updateStatus };
=======
const db = require("../config/db");


// Get all leave requests
const getLeaveRequests = async () => {

    const [rows] = await db.query(
        "SELECT * FROM leave_requests"
    );

    return rows;
};


// Get leave requests for one employee
const getEmployeeLeaveRequests = async (employeeId) => {

    const [rows] = await db.query(
        "SELECT * FROM leave_requests WHERE employee_id = ?",
        [employeeId]
    );

    return rows;
};


// Create a leave request
const createLeaveRequest = async (leave) => {

    const {
        employee_id,
        date,
        reason,
        status
    } = leave;

    const [result] = await db.query(
        `INSERT INTO leave_requests
        (employee_id, date, reason, status)
        VALUES (?, ?, ?, ?)`,
        [
            employee_id,
            date,
            reason,
            status
        ]
    );

    return result;
};


// Update a leave request
const updateLeaveRequest = async (id, leave) => {

    const {
        employee_id,
        date,
        reason,
        status
    } = leave;

    const [result] = await db.query(
        `UPDATE leave_requests
        SET employee_id = ?,
            date = ?,
            reason = ?,
            status = ?
        WHERE id = ?`,
        [
            employee_id,
            date,
            reason,
            status,
            id
        ]
    );

    return result;
};


// Delete a leave request
const deleteLeaveRequest = async (id) => {

    const [result] = await db.query(
        "DELETE FROM leave_requests WHERE id = ?",
        [id]
    );

    return result;
};


module.exports = {
    getLeaveRequests,
    getEmployeeLeaveRequests,
    createLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest
};
>>>>>>> Elijah/backend
