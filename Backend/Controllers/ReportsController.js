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
    console.error('Unable to load reports:', error.message);
    res.status(500).json({ success: false, message: 'Unable to load reports.' });
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
    console.error('Unable to generate report:', error.message);
    res.status(500).json({ success: false, message: 'Report persistence is not available.' });
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
    console.error('Unable to delete report:', error.message);
    res.status(500).json({ success: false, message: 'Report persistence is not available.' });
  }
};
