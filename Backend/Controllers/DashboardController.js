const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

// Get overall dashboard statistics and analytics
exports.getDashboardStats = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const activeEmployees = await Employee.countDocuments({ status: 'Active' });
        const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });

        // Aggregate employees by department
        const employeesByDepartment = await Employee.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } }
        ]);

        // Aggregate leave stats by status
        const leaveStats = await Leave.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalEmployees,
                    activeEmployees,
                    pendingLeaves
                },
                employeesByDepartment,
                leaveStats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};