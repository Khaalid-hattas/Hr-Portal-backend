import express from 'express';
import { getRequests, updateRequest } from '../Controllers/leaveController.js';

const router = express.Router();
router.get('/', getRequests);
router.patch('/:id', updateRequest);

export default router;
