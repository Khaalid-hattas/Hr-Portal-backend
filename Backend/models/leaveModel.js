import pool from '../../config/db.js';

export async function findAll() {
    const [rows] = await pool.query(`
        SELECT MAX(t.request_id) AS request_id, t.employee_id,
               COALESCE(e.name, ei.name, CONCAT('Employee #', t.employee_id)) AS employee_name,
               COALESCE(ei.department, '') AS department,
               t.leave_type, t.start_date, t.end_date, t.reason, t.status
        FROM time_off_requests t
        LEFT JOIN employees e ON e.employee_id = t.employee_id
        LEFT JOIN employee_information ei ON ei.employee_id = t.employee_id
        GROUP BY t.employee_id, employee_name, department,
                 t.leave_type, t.start_date, t.end_date, t.reason, t.status
        ORDER BY request_id DESC
    `);
    return rows;
}

export async function updateStatus(id, status) {
    return pool.query(
        'UPDATE time_off_requests SET status = ? WHERE request_id = ?',
        [status, id]
    );
}
