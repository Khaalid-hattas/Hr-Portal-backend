import {
  getAllReports as fetchAllReports,
  createReport as saveReport,
  deleteReportById
} from '../models/ReportsModels.js';

export const getAllReports = async (req, res) => {
  try {
    const reports = await fetchAllReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { title, type, generatedBy, startDate, endDate, department } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title and type are required.'
      });
    }

    const report = await saveReport({
      title,
      type,
      generatedBy,
      startDate,
      endDate,
      department
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const deleted = await deleteReportById(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};