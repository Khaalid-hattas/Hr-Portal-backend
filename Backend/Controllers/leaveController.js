import { findAll, updateStatus } from '../models/leaveModel.js';

export async function getRequests(req, res) {
    try { res.json(await findAll()); }
    catch (err) { res.status(500).json({ error: err.message }); }
}

export async function updateRequest(req, res) {
    try {
        const { status } = req.body || {};
        const allowed = ['Pending', 'Approved', 'Rejected'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}.` });
        }
        const [result] = await updateStatus(req.params.id, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `No time-off request found with id ${req.params.id}.` });
        }
        res.json({ updated: result.affectedRows });
    } catch (err) { res.status(500).json({ error: err.message }); }
}

