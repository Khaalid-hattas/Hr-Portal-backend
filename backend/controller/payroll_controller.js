import { db } from "../config/payroll_config.js";
import { getPayroll, getPayrollData, newPayrollData,getSinglePayrollData } from "../model/payroll_db.js";

import { getEmployeesInfo } from "../model/employees_db.js";



export const getPayrollCon = async (req, res) => {
  try {
    const payroll = await getPayrollData();
    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch payroll records!",
      message: error.message,
    });
  }
};

export const Payslip = async (req, res) => {
  try {
    const employee_id = req.body.employee_id;
    const hours_worked = req.body.hours_worked;
    const leave_deductions = req.body.leave_deductions;

    // this will be the  input validation 
    if (!employee_id || hours_worked === undefined || leave_deductions === undefined) {
      return res.status(400).json({ 
        error: "Please provide employee_id, hours_worked, and leave_deductions." 
      });
    }

    // here i am fetching the  employee  salary from database
    const employee = await getEmployeesInfo(employee_id);

    if (!employee) {
      return res.status(404).json({ 
        error: "Employee not found." 
      });
    }

    const baseSalary = Number(employee.salary);
    const hoursWorkedNumber = Number(hours_worked);
    const deductionsNumber = Number(leave_deductions);

    // checking for division by zero
    const effectiveHours = hoursWorkedNumber - deductionsNumber;
    if (effectiveHours <= 0) {
      return res.status(400).json({ 
        error: "Invalid input: (hours_worked - leave_deductions) must be greater than zero." 
      });
    }

    // here are the calculations
    const finalSalary = baseSalary; 
    const hourlyRate = finalSalary / effectiveHours;

    const formattedFinalSalary = finalSalary.toFixed(2);
    const formattedHourlyRate = hourlyRate.toFixed(2);

    // a new employees will be saved to database using employee_id as Primary Key
    await newPayrollData(
      employee_id, 
      hours_worked, 
      leave_deductions, 
      formattedFinalSalary
    );

    return res.status(201).json({
      message: "Payroll entry processed successfully!",
      employee_id: employee_id,
      calculated_salary: formattedFinalSalary,
      hourly_rate: formattedHourlyRate
    });

  } catch (error) {
    return res.status(500).json({ 
      error: "Server error processing payroll", 
      details: error.message 
    });
  }
};

export const getSinglePayrollCon = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await getSinglePayrollData(id);

    if (!payroll) {
      return res.status(404).json({ error: "Payroll record not found" });
    }
    res.status(200).json(payroll);
  } 
  catch (error) {
    res.status(500).json({ error: "Failed to fetch payroll record", message: error.message });
  }
};