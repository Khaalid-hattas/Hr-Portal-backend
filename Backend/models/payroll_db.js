import  {db}  from "../config/payroll_config.js";

// here i will be creating a function that fetches the payroll informations and returns an error and a message if the api does not get.

export const getPayroll = async () => {
  let [rows] = await db.query(`SELECT * FROM payroll_table`)
  return rows;

};

export const getPayrollData = async () => {
  const query = `
  SELECT 
  employees_table.employees_id AS employee_id,
  employees_table.name,
  employees_table.position,
  employees_table.department,
  employees_table.salary AS base_salary,
  payroll_table.hours_worked,
  payroll_table.leave_deductions,
  payroll_table.final_salary
  FROM payroll_table
  INNER JOIN employees_table 
  ON payroll_table.employee_id = employees_table.employees_id;
  `;
  const [rows] = await db.query(query);
  return rows;
};


export const newPayrollData = async (employee_id, hours_worked, leave_deductions, final_salary) => {
  const query = `
  INSERT INTO payroll_table (employee_id, hours_worked, leave_deductions, final_salary)
  VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE 
    hours_worked = VALUES(hours_worked),
    leave_deductions = VALUES(leave_deductions),
    final_salary = VALUES(final_salary)
  
`;
  const [result] = await db.query(query, [employee_id, hours_worked, leave_deductions, final_salary]);
  return result;
};

export const getSinglePayrollData = async (id) => {
  const query = `
  SELECT 
  employees_table.employees_id AS employee_id,
  employees_table.name,
  employees_table.position,
  employees_table.department,
  employees_table.salary AS base_salary,
  payroll_table.hours_worked,
  payroll_table.leave_deductions,
  payroll_table.final_salary
  FROM payroll_table
  INNER JOIN employees_table 
    ON payroll_table.employee_id = employees_table.employees_id
  WHERE payroll_table.employee_id = ?;
  `;
  const [rows] = await db.query(query, [id]);
  return rows[0];
};