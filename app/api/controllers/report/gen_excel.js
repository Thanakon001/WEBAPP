const ExcelJS = require('exceljs');

const genExcel = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('รายงานการเงิน');

        worksheet.columns = [
            { header: 'เดือน', key: 'เดือน', width: 15 },
            { header: 'ประเภท', key: 'ประเภท', width: 10 }, 
            { header: 'หมวดหมู่', key: 'หมวดหมู่', width: 15 },
            { header: 'รายรับ (บาท)', key: 'รายรับ', width: 15 },
            { header: 'รายจ่าย (บาท)', key: 'รายจ่าย', width: 15 },
        ];

        data.forEach((item) => {
            worksheet.addRow(item);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=รายงานการเงิน.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).send('การสร้าง Excel ล้มเหลว');
    }
}

module.exports = { genExcel };
