import express from 'express';
import db from '../configurations/db.js';
import {body, validationResult} from 'express-validator';

const router = express.Router();

// GET all employees
router.get('/', (req, res) => {
  const sql = `SELECT employees_id as employees_id, name, department, position, salary, status FROM employees_table`;
  db.query(sql, (error, results) => {
    if(error) return res.status(500).json({error: error});
    res.json(results);
  });
});
// get all archived employees
router.get('/archived', (req,res) => {
  const sql = `SELECT employees_id AS employees_id, name, department, position, salary, status FROM archived_employees`;
  db.query (sql, (error, result) => {
    if(error) return res.status(500).json({error: error.message});
    res.json(result);
  })
})

// GET employees by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sql = `SELECT employees_id as employees_id, name, department, position, salary, status FROM employees_table WHERE employees_id = ?`;

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
router.delete('/:id', (req,res) => {
  const id = parseInt(req.params.id);
// employee data
  const getSql = `SELECT * FROM employees_table WHERE employees_id = ?`;
  db.query(getSql, [id], (error, result) => {
    if(error) return res.status(500).json({error: error.message});
    if(result.length ===0) return res.status(404).json({message: "Employee not found"});

    const employee = result[0];

    // insert into archived_employees
    const insertSql = `INSERT INTO archived_employees (employees_id, name, position, department, salary, employmentHistory, contact, status) VALUE (?, ?, ?, ?, ?, ?, ?, 'inactive')`;

    db.query(insertSql, [employee.employees_id, employee.name, employee.position, employee.department, employee.salary, employee.employmentHistory, employee.contact ], (error2) => {
      if(error2) return res.status(500).json({error: error2.message});

      const deleteSql = `DELETE FROM employees_table WHERE employees_id = ?`;
      db.query(deleteSql, [id], (error3) => {
        if(error3) return res.status(500).json({error: error3.message});
        res.json({message: 'Employee archived successfully', id: id});
      });
    });
  });
});

// restore from archive
router.post('/restore/:id', (req,res) => {
  const id = parseInt(req.params.id);

  const getSql = `SELECT * FROM archived_employees WHERE employees_id = ?`;
  db.query(getSql,[id], (error, result) => {
    if(error) return res.status(500).json({error:error.message});
    if(result.length === 0) return res.status(404).json({message: 'Employee not found'});

    const employee = result[0];

    const insertSql = `INSERT INTO employees_table (employees_id, name, position, department, salary, employmentHistory, contact, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`;

    db.query(insertSql, [employee.employees_id, employee.name, employee.position, employee.department, employee.salary, employee.employmentHistory, employee.contact], (error2) => {
      if(error2) return res.status(500).json({error: error2.message});

      const deleteSql = `DELETE FROM archived_employees WHERE employees_id = ?`;
      db.query(deleteSql, [id], (error3) => {
        if(error3) return res.status(500).json({error: error3.message});
        res.json({message: 'Employee restored', id: id});
      });
    });
  });
});

export default router;