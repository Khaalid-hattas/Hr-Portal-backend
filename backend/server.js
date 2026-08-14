// Changed: load .env first so DB credentials are available before anything else runs
require('dotenv').config();

const express = require('express');
const cors    = require('cors');

// Changed: import the shared pool from db.js instead of creating a second inline pool
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ─── employees bootstrap ───────────────────────────────────────────────────────
// Creates and seeds the employees table on startup (IF NOT EXISTS / INSERT IGNORE)
// so the Time Off JOIN has real names without touching any other page's data source.

const EMPLOYEES = [
    { employee_id: 1,  name: 'Sibongile Nkosi',  department: 'Development', position: 'Software Engineer' },
    { employee_id: 2,  name: 'Lungile Moyo',      department: 'HR',          position: 'HR Manager' },
    { employee_id: 3,  name: 'Thabo Molefe',      department: 'QA',          position: 'Quality Analyst' },
    { employee_id: 4,  name: 'Keshav Naidoo',     department: 'Sales',       position: 'Sales Representative' },
    { employee_id: 5,  name: 'Zanele Khumalo',    department: 'Marketing',   position: 'Marketing Specialist' },
    { employee_id: 6,  name: 'Sipho Zulu',        department: 'Design',      position: 'UI/UX Designer' },
    { employee_id: 7,  name: 'Naledi Moeketsi',   department: 'IT',          position: 'DevOps Engineer' },
    { employee_id: 8,  name: 'Farai Gumbo',       department: 'Marketing',   position: 'Content Strategist' },
    { employee_id: 9,  name: 'Karabo Dlamini',    department: 'Finance',     position: 'Accountant' },
    { employee_id: 10, name: 'Fatima Patel',       department: 'Support',     position: 'Customer Support Lead' },
];

async function bootstrapEmployees() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS employees (
                employee_id INT PRIMARY KEY,
                name        VARCHAR(100) NOT NULL,
                department  VARCHAR(100) NOT NULL,
                position    VARCHAR(100) NOT NULL
            )
        `);

        for (const emp of EMPLOYEES) {
            await db.query(
                `INSERT IGNORE INTO employees (employee_id, name, department, position)
                 VALUES (?, ?, ?, ?)`,
                [emp.employee_id, emp.name, emp.department, emp.position]
            );
        }

        console.log('employees table ready.');
    } catch (err) {
        console.error('bootstrapEmployees error:', err.message);
    }
}

bootstrapEmployees();

// ─── employees list endpoint (used by Time Off create-request dropdown) ────────

app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT employee_id, name, department, position FROM employees ORDER BY employee_id ASC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── time_off_requests routes ─────────────────────────────────────────────────

// Changed: JOIN employees so real name and department are included in every row
app.get('/api/timeoff', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                t.request_id,
                t.employee_id,
                COALESCE(e.name,       CONCAT('Employee #', t.employee_id)) AS employee_name,
                COALESCE(e.department, '')                                   AS department,
                t.leave_type,
                t.start_date,
                t.end_date,
                t.reason,
                t.status
            FROM time_off_requests t
            LEFT JOIN employees e ON e.employee_id = t.employee_id
            ORDER BY t.request_id DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Changed: new POST route — validates required fields and date ordering before inserting
app.post('/api/timeoff', async (req, res) => {
    try {
        const { employee_id, leave_type, start_date, end_date, reason } = req.body;

        // Validate required fields
        if (!employee_id || !leave_type || !start_date || !end_date) {
            return res.status(400).json({
                error: 'employee_id, leave_type, start_date, and end_date are required.'
            });
        }

        // employee_id must be a positive integer
        const empId = parseInt(employee_id, 10);
        if (!Number.isInteger(empId) || empId <= 0) {
            return res.status(400).json({
                error: 'employee_id must be a positive integer.'
            });
        }

        // end_date must not be before start_date
        if (new Date(end_date) < new Date(start_date)) {
            return res.status(400).json({
                error: 'end_date cannot be before start_date.'
            });
        }

        const [employees] = await db.query(
            'SELECT employee_id FROM employees WHERE employee_id = ? LIMIT 1',
            [empId]
        );
        if (employees.length === 0) {
            return res.status(400).json({
                error: 'Selected employee does not exist.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO time_off_requests
                (employee_id, leave_type, start_date, end_date, reason, status)
             VALUES (?, ?, ?, ?, ?, 'Pending')`,
            [empId, leave_type, start_date, end_date, reason || null]
        );

        res.status(201).json({ request_id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Changed: new PATCH route — updates ONLY the status column; validates allowed values and 404s when id is missing
app.patch('/api/timeoff/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = ['Pending', 'Approved', 'Rejected'];
        if (!allowed.includes(status)) {
            return res.status(400).json({
                error: `status must be one of: ${allowed.join(', ')}.`
            });
        }

        const [result] = await db.query(
            'UPDATE time_off_requests SET status = ? WHERE request_id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: `No time-off request found with id ${id}.`
            });
        }

        res.json({ updated: result.affectedRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Changed: new DELETE route — 404s when the row doesn't exist
app.delete('/api/timeoff/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM time_off_requests WHERE request_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: `No time-off request found with id ${id}.`
            });
        }

        res.json({ deleted: result.affectedRows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────

app.listen(3000, () => console.log('Node + SQL server running on http://localhost:3000'));
