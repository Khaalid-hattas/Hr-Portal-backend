import express from 'express';
import {
  getDashboardStats,
  getAttendanceOverview,
  getLeaveOverview,
  getEmployeeList
} from '../Controllers/DashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/attendance', getAttendanceOverview);
router.get('/leaves', getLeaveOverview);
router.get('/employees', getEmployeeList);

export default router;