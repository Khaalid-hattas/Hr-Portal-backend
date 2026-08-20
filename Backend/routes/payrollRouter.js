import express from 'express';

import { getPayrollCon, Payslip, getSinglePayrollCon } from "../Controllers/payroll_controller.js";

const router = express.Router();

/*  note

GET / payroll = getPayrollCon
GET / payroll/:id = getSinglePayrollCON
POST / /payroll = Payslip

*/

router.get('/',getPayrollCon);

router.post('/', Payslip);

router.get('/:id', getSinglePayrollCon);


export default router;
