// here will be the callbacks.
import { db } from "../config/payroll_config.js";

import { getEmployees,getEmployeesInfo } from "../model/employees_db.js";

export const getEmployeesControllers = async (req, res) => {
  try {
    const employees = await getEmployees();
    res.status(200).json(employees);
  } 
  catch (error) {
    res.status(500).json({
      error: "Failed to fetch employees info",
      message: error.message,
      });
  }
};

export const getSingleEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await getEmployeesInfo(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } 
  catch (error) {
    res.status(500).json({ error: "Failed to fetch employee", message: error.message });
  }
};