import express from 'express';
import {
  getAllReports,
  generateReport,
  deleteReport
} from '../Controllers/ReportsController.js';

const router = express.Router();

router.route('/')
  .get(getAllReports)
  .post(generateReport);

router.route('/:id')
  .delete(deleteReport);

export default router;