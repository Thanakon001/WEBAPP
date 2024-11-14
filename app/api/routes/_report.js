const express = require('express');
const { ExportToPDF } = require('../controllers/report/gen_pdf');
const { genExcel } = require('../controllers/report/gen_excel');
const router = express.Router();

router.post('/pdf', ExportToPDF);
router.post('/excel', genExcel);
module.exports = router;
