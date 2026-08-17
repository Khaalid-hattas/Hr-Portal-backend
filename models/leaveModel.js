const db = require('../config/db');

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
