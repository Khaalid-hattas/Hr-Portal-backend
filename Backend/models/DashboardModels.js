import pool from '../config/database.js';

export const getDashboardStats = async () => {
  const [employeeRows] = await pool.query(
    'SELECT COUNT(*) AS totalEmployees FROM employee_information'
  );

  const [payrollRows] = await pool.query(
    'SELECT COALESCE(SUM(final_salary), 0) AS totalPayroll FROM payroll'
  );

  const [leaveRows] = await pool.query(
    "SELECT COUNT(*) AS pendingLeaves FROM leave_requests WHERE status = 'Pending'"
  );

  const [departmentRows] = await pool.query(
    `SELECT department, COUNT(*) AS total
     FROM employee_information
     GROUP BY department
     ORDER BY total DESC`
  );

  return {
    totalEmployees: Number(employeeRows[0]?.totalEmployees || 0),
    totalPayroll: Number(payrollRows[0]?.totalPayroll || 0),
    pendingLeaves: Number(leaveRows[0]?.pendingLeaves || 0),
    departments: departmentRows || []
  };
};

export const getAttendanceSummary = async () => {
  const [attendanceRows] = await pool.query(
    `SELECT status, COUNT(*) AS total
     FROM attendance
     GROUP BY status`
  );

  const [recentRows] = await pool.query(
    `SELECT e.employee_id, e.name, a.date, a.status
     FROM attendance a
     INNER JOIN employees e ON e.employee_id = a.employee_id
     ORDER BY a.date DESC
     LIMIT 10`
  );

  const summary = {
    present: 0,
    absent: 0
  };

  (attendanceRows || []).forEach((row) => {
    const key = String(row.status).toLowerCase();
    if (key === 'present') summary.present = Number(row.total || 0);
    if (key === 'absent') summary.absent = Number(row.total || 0);
  });

  return {
    summary,
    recentAttendance: recentRows || []
  };
};

export const getLeaveSummary = async () => {
  const [leaveRows] = await pool.query(
    `SELECT status, COUNT(*) AS total
     FROM leave_requests
     GROUP BY status`
  );

  const [recentRows] = await pool.query(
    `SELECT lr.request_id, e.name, lr.reason, lr.date, lr.status
     FROM leave_requests lr
     INNER JOIN employees e ON e.employee_id = lr.employee_id
     ORDER BY lr.date DESC
     LIMIT 10`
  );

  const summary = {
    approved: 0,
    pending: 0,
    denied: 0
  };

  (leaveRows || []).forEach((row) => {
    const key = String(row.status).toLowerCase();
    if (key === 'approved') summary.approved = Number(row.total || 0);
    if (key === 'pending') summary.pending = Number(row.total || 0);
    if (key === 'denied') summary.denied = Number(row.total || 0);
  });

  return {
    summary,
    recentLeaves: recentRows || []
  };
};

export const getAllEmployees = async () => {
  const [rows] = await pool.query(
    `SELECT employee_id AS employeeId, name, department, position 
     FROM employee_information 
     ORDER BY name ASC`
  );

  return {
    employeeInformation: rows || []
  };
};