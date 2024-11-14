const conn = require("../../config/dbConfig")
const dataReport = async (req, res) => {
    let sql = '';
    let sub_param = [];
    const { action, company } = req.body
    try {
        switch (action) {
            case "index":
                sql = `SELECT
                        SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) AS total_income,
                        SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_expense,
                        SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) - SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_balance
                    FROM 
                        details_list 
                    WHERE 
                        com_id = ? 
                    AND 
                        MONTH(detail_date) = MONTH(CURRENT_DATE())
                    AND
                        YEAR(detail_date) = YEAR(CURRENT_DATE())
                    GROUP BY 
                        MONTH(detail_date),YEAR(detail_date)
                    ORDER BY 
                        MONTH(detail_date),YEAR(detail_date);`
                sub_param = [company]
                break;
            case "indexcoust":
                sql = `SELECT 
                        SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) AS total_income,
                        SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_expense,
                        SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) - SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_balance
                    FROM 
                        details_list 
                    WHERE 
                        com_id = ?`
                sub_param = [company]
                break;
            case "day":
                sql =
                    `SELECT
                    detail_date,
                    SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) AS total_income,
                    SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_expense
                FROM 
                    details_list
                WHERE
                    com_id = ?
                GROUP BY 
                    detail_date
                ORDER BY 
                    detail_date;`
                sub_param = [company]
                break;

            case "month":
                sql = `
                SELECT
                    details_list.type_note,
                    type_list.type_id,
                    type_list.type_name,
                    DATE_FORMAT(detail_date, '%m-%Y') AS month,
                    SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) AS total_income,
                    SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_expense
                FROM 
                    details_list
                INNER JOIN 
                    type_list ON details_list.type_id = type_list.type_id
                WHERE
                    details_list.com_id = ?
                GROUP BY 
                    type_list.type_id,
                    details_list.type_note,
                    type_list.type_name,
                    month
                ORDER BY 
                    type_list.type_id,
                    details_list.type_note,
                    month;`
                sub_param = [company]
                break;

            case "year":
                sql = `
                    SELECT
                        DATE_FORMAT(detail_date, '%Y') AS year,
                        SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) AS total_income,
                        SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_expense
                    FROM 
                        details_list
                    INNER JOIN 
                        type_list ON details_list.type_id = type_list.type_id
                    WHERE
                        details_list.com_id = ?
                    GROUP BY 
                        year
                    ORDER BY 
                        year;
                    `
                sub_param = [company]
                break;
            default:
                return res.status(400).json({ message: 'การดำเนินการไม่ถูกต้อง' });
        }

        if (!sql) {
            return res.status(400).json({ message: 'ไม่พบข้อมูล' });
        }

        const data = await new Promise((resolve, reject) => {
            conn.query(sql, sub_param, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });

        res.json({ message: 'ok', data });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }

};

module.exports = dataReport
