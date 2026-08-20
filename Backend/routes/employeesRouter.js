import express from "express";

import { db } from "../config/payroll_config.js";

import {
  getEmployeesControllers,
  getSingleEmployeeController,
} from "../controller/employees_controller.js";

const router = express.Router();

router.get("/", getEmployeesControllers);
router.get("/:id", getSingleEmployeeController);

export default router;