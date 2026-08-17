const express = require('express');
const controller = require('../Controllers/leaveController');

const router = express.Router();
router.get('/', controller.getRequests);
router.patch('/:id', controller.updateRequest);

module.exports = router;
