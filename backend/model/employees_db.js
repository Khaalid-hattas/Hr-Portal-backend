import 
{db} from "../config/payroll_config.js";

// here i will be creating a function to fetch info in the employees table.

export const getEmployees = async () => {
  const [rows] = await db.query(`SELECT * FROM employees_table`)
  
  return rows
};

export const getEmployeesInfo = async (id) => {
  let [rows] = await db.query(`SELECT * FROM employees_table WHERE  employees_id =?`,[id]);
  return rows[0]
};