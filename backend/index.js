
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import {db} from './config/payroll_config.js';
import {getEmployeesControllers}  from './controller/employees_controller.js';
import { getPayrollCon } from './controller/payroll_controller.js';

import employeesRouter from './routers/employeesRouter.js';

import payrollRouter from './routers/payrollRouter.js';

//import payrollRoutes from '/routers/payrollRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());



// payroll page 
// routes 

app.use('/employees', employeesRouter);
app.use('/payroll', payrollRouter);

app.get('/',(req,res)=>{
  res.status(200).json({message: "HR Payroll API is running! status! yey!"})
});

app.use((req,res)=>{
  res.status(404).json({message: "HR Payroll not found! oh no! don't worry we will fix it ;) "})
});



// app.get('/payroll_table',getPayrollCon);

// app.get('/employees_table',getEmployeesControllers);



app.listen(1800,()=>{
  console.log("Server is running on http://localhost:1800");
});
