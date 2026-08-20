import 
{db} from "../config/payroll_config.js";

// here i will be creating a function to fetch info in the employees table.

export const getEmployees = async () => {
  const [rows] = await db.query(`
    SELECT e.employee_id AS employees_id,
           COALESCE(i.name, e.name) AS name,
           i.position, i.department, i.salary, 'active' AS status
    FROM employees e
    LEFT JOIN employee_information i ON i.employee_id = e.employee_id
    ORDER BY e.employee_id
  `)
  
  return rows
};

export const getEmployeesInfo = async (id) => {
  let [rows] = await db.query(`
    SELECT e.employee_id AS employees_id,
           COALESCE(i.name, e.name) AS name,
           i.position, i.department, i.salary, 'active' AS status
    FROM employees e
    LEFT JOIN employee_information i ON i.employee_id = e.employee_id
    WHERE e.employee_id = ?
  `, [id]);
  return rows[0]
};
