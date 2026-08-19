import express from 'express';


import { getPayrollCon } from "../controller/payroll_controller.js";

import { Payslip, getSinglePayrollCon} from '../controller/payroll_controller.js';


const router = express.Router();

router.get('/',getPayrollCon);


//this one is for the  payslips
router.post('/calculate', Payslip);

router.get('/:id', getSinglePayrollCon);


export default router;