import express from 'express';
import db from '../configurations/db.js';
import {body, validationResult} from 'express-validator';

const router = express.Router();

// GET all employees
router.get('/', (req, res) => {
  const sql = `
    SELECT
      e.employee_id AS employees_id,
      COALESCE(i.name, e.name) AS name,
      i.department,
      i.position,
      i.salary,
      'active' AS status
    FROM employees e
    LEFT JOIN employee_information i ON i.employee_id = e.employee_id
    ORDER BY e.employee_id
  `;
  db.query(sql, (error, results) => {
    if(error) return res.status(500).json({error: error});
    res.json(results);
  });
});
// get all archived employees
router.get('/archived', (req, res) => {
  const sql = `
    SELECT employee_id AS employees_id, name, position, department,
           salary, status
    FROM archived_employees
    ORDER BY employee_id
  `;
  db.query(sql, (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json(results);
  });
});

// GET employees by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sql = `
    SELECT
      e.employee_id AS employees_id,
      COALESCE(i.name, e.name) AS name,
      i.department,
      i.position,
      i.salary,
      'active' AS status
    FROM employees e
    LEFT JOIN employee_information i ON i.employee_id = e.employee_id
    WHERE e.employee_id = ?
  `;

  db.query (sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json({error: error.message});
    }
    if(result.length === 0) {
      return res.status(404).json({message: 'Employee not found'});
    }
    res.json(result[0]);
  });
});

// POST add new employee
router.post('/', [
  body('name').notEmpty(),
  body('salary').isFloat({min:0})
], (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

  const {name, position, department, salary, employmentHistory, contact} = req.body;
  const sql = `INSERT INTO employees_table(name, position, department, salary, employmentHistory, contact)VALUES (?, ?, ?, ?, ?, ?)`;
  db.query (sql, [name, position, department, salary, employmentHistory, contact], (error, result) => {
    if(error) return res.status(500).json({error: error});
    res.status(201).json({message: 'New employee added', id: result.insertId});
  });
});

// Archive employee
router.delete('/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const getSql = `
    SELECT e.employee_id, COALESCE(i.name, e.name) AS name,
           i.position, i.department, i.salary, i.employment_history, i.contact
    FROM employees e
    LEFT JOIN employee_information i ON i.employee_id = e.employee_id
    WHERE e.employee_id = ?
  `;

  db.query(getSql, [id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employee = result[0];
    const archiveSql = `
      INSERT INTO archived_employees
        (employee_id, name, position, department, salary,
         employment_history, contact, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'archived')
      ON DUPLICATE KEY UPDATE status = 'archived'
    `;

    db.query(archiveSql, [
      employee.employee_id,
      employee.name,
      employee.position,
      employee.department,
      employee.salary,
      employee.employment_history,
      employee.contact,
    ], (archiveError) => {
      if (archiveError) {
        return res.status(500).json({ error: archiveError.message });
      }

      db.query('DELETE FROM employees WHERE employee_id = ?', [id], (deleteError) => {
        if (deleteError) return res.status(500).json({ error: deleteError.message });
        res.json({ message: 'Employee archived successfully', id });
      });
    });
  });
});

// restore from archive
router.post('/restore/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const getSql = 'SELECT * FROM archived_employees WHERE employee_id = ?';

  db.query(getSql, [id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });
    if (result.length === 0) {
      return res.status(404).json({ message: 'Archived employee not found' });
    }

    const employee = result[0];
    db.query(
      'INSERT INTO employees (employee_id, name) VALUES (?, ?)',
      [employee.employee_id, employee.name],
      (insertError) => {
        if (insertError) return res.status(500).json({ error: insertError.message });

        db.query(
          `INSERT INTO employee_information
             (employee_id, name, position, department, salary,
              employment_history, contact)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name = VALUES(name),
             position = VALUES(position), department = VALUES(department),
             salary = VALUES(salary), employment_history = VALUES(employment_history),
             contact = VALUES(contact)`,
          [employee.employee_id, employee.name, employee.position,
           employee.department, employee.salary, employee.employment_history,
           employee.contact],
          (infoError) => {
            if (infoError) return res.status(500).json({ error: infoError.message });
            db.query('DELETE FROM archived_employees WHERE employee_id = ?', [id], (deleteError) => {
              if (deleteError) return res.status(500).json({ error: deleteError.message });
              res.json({ message: 'Employee restored', id });
            });
          }
        );
      }
    );
  });
});

export default router;
