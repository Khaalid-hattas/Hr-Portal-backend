const Report = require('../models/Report');
const Leave = require('../models/Leave');

// Get all generated reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('generatedBy', 'firstName lastName email');
        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Generate a new report
exports.generateReport = async (req, res) => {
    try {
        const { title, type, generatedBy, startDate, endDate, department } = req.body;

        const report = await Report.create({
            title,
            type,
            generatedBy,
            parameters: { startDate, endDate, department },
            status: 'Completed' // Set to Completed once processing finishes
        });

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete a report
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        res.status(200).json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};