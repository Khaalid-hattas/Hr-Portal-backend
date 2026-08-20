import { findAll, updateStatus } from '../models/leaveModel.js';

export async function getRequests(req, res) {
    try {
        res.json(await findAll());
    } catch (err) {
        console.error('Unable to load time-off requests:', err.message);
        res.status(500).json({ error: 'Unable to load time-off requests.' });
    }
}

export async function updateRequest(req, res) {
    try {
        const requestId = Number(req.params.id);
        if (!Number.isInteger(requestId) || requestId < 1) {
            return res.status(400).json({ error: 'id must be a positive integer.' });
        }

        const { status } = req.body || {};
        const allowed = ['Pending', 'Approved', 'Rejected'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}.` });
        }
        const [result] = await updateStatus(requestId, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `No time-off request found with id ${req.params.id}.` });
        }
        res.json({ updated: result.affectedRows });
    } catch (err) {
        console.error('Unable to update time-off request:', err.message);
        res.status(500).json({ error: 'Unable to update time-off request.' });
    }
}

