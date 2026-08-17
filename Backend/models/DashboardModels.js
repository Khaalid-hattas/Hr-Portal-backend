const mongoose = require('mongoose');

const DashboardConfigSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
        unique: true
    },
    widgets: [{
        widgetName: { type: String, required: true },
        isEnabled: { type: Boolean, default: true },
        position: { type: Number, default: 0 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('DashboardConfig', DashboardConfigSchema);