const express = require('express');
const router = express.Router();
const {
    getAllReports,
    generateReport,
    deleteReport
} = require('../controllers/reportController');

router.route('/')
    .get(getAllReports)
    .post(generateReport);

router.route('/:id')
    .delete(deleteReport);

module.exports = router;