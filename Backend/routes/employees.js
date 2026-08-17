import express from 'express';
import db from '../configurations/db.js';
import {body, validationResult} from 'express-validator';

const router = express.Router();

// GET all employees
router.get('/', (req, res) => {
  const sql = `SELECT * FROM employees_table`;
  db.query(sql, (error, results) => {
    if(error) return res.status(500).json({error: error});
    res.json(results);
  });
});

// GET employees by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const sql = `SELECT * FROM employees_table WHERE employees_id = ?`;

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

// Delete employee 
router.delete('/:id', (req,res) => {
  const id = parseInt(req.params.id);
  const sql = `DELETE FROM employees_table WHERE employees_id = ?`;

  db.query(sql, [id], (error, result) => {
    if(error) {
      return res.status(500).json({error: error.message});
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({message: 'Employee not found'});
    }
    res.json({ message: 'Employee deleted', id: id});
  });
});

export default router;