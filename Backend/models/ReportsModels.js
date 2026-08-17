const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Report title is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Employee Summary', 'Leave Analysis', 'Payroll Report', 'Attendance Summary'],
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    parameters: {
        startDate: { type: Date },
        endDate: { type: Date },
        department: { type: String }
    },
    fileUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);