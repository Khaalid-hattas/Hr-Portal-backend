import {
  getDashboardStats as getDashboardSummary,
  getAttendanceSummary,
  getLeaveSummary,
  getAllEmployees
} from '../models/DashboardModels.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardSummary();

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalEmployees: stats.totalEmployees,
          totalPayroll: stats.totalPayroll,
          pendingLeaves: stats.pendingLeaves,
          activeEmployees: stats.totalEmployees
        },
        departments: stats.departments || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAttendanceOverview = async (req, res) => {
  try {
    const attendance = await getAttendanceSummary();

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getLeaveOverview = async (req, res) => {
  try {
    const leaveData = await getLeaveSummary();

    res.status(200).json({
      success: true,
      data: leaveData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEmployeeList = async (req, res) => {
  try {
    const employees = await getAllEmployees();

    res.status(200).json({
      success: true,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};