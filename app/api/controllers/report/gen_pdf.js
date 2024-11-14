const htmltopdf = require('html-pdf-node');
const ejs = require('ejs');
const path = require('path');
const conn = require('../../config/dbConfig');

const ExportToPDF = async (req, res) => {
    try {
        const { action, data, com_id } = req.body;

        if (!action || !data) {
            return res.status(400).send('Missing action or data');
        }

        let pathFile;
        if (action === 'reportnote') {
            pathFile = path.join(__dirname, './templates/report_note.ejs');
        } else if (action === 'reporttime') {
            pathFile = path.join(__dirname, './templates/report_time.ejs');
        } else if (action === 'reportyear') {
            pathFile = path.join(__dirname, './templates/report_year.ejs');
        } else {
            return res.status(400).send('Invalid action');
        }

        let headers;
        let sql = `SELECT * FROM company_list WHERE com_id = ?`
        let result = await new Promise((resolve, reject) => {
            conn.query(sql, [com_id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        headers = result[0];

        const chunkSize = 30;
        const dataChunks = [];
        for (let i = 0; i < data.length; i += chunkSize) {
            dataChunks.push(data.slice(i, i + chunkSize));
        }

        const pdfBuffers = [];
        for (let i = 0; i < dataChunks.length; i++) {
            const htmlContent = await ejs.renderFile(pathFile, { data: dataChunks[i], headers: headers });

            let file = { content: htmlContent };
            let options = { format: 'A4' };

            const pdfBuffer = await htmltopdf.generatePdf(file, options);
            pdfBuffers.push(pdfBuffer);
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="output.pdf"',
            'Accept': 'application/pdf',
        });

        const finalPdfBuffer = Buffer.concat(pdfBuffers);
        res.send(finalPdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('การสร้าง PDF ล้มเหลว');
    }
};

module.exports = {
    ExportToPDF,
};
