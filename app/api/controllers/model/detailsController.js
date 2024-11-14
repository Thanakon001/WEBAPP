const conn = require("../../config/dbConfig")

const details = async (req, res) => {
    let sql = ''
    let sub_param = []
    const { detail_date, type_id, type_note, detail_note, detail_coust, id, date_start, date_end, action, company } = req.body

    if (!company) {
        return res.status(400).json({ message: 'ไม่พบข้อมูลบริษัท กรุณาเพิ่มบริษัทก่อน' })
    }

    try {
        switch (action) {
            case 'all':
                sql = `SELECT * 
                        FROM details_list
                        INNER JOIN type_list ON details_list.type_id = type_list.type_id
                        WHERE details_list.com_id = ?
                        ORDER BY detail_date;
                        `
                sub_param = [company]
                break;
            case 'insert':
                sql = `INSERT INTO details_list (detail_date, type_id, type_note, detail_note, detail_coust,com_id) VALUES (?, ?, ?, ?, ?,?)`
                sub_param = [detail_date, type_id, type_note, detail_note, detail_coust, company]
                break;

            case 'update':
                sql = `UPDATE details_list SET detail_date=?, type_id=?, type_note=?, detail_note=?, detail_coust=? WHERE id=? AND com_id = ?`
                sub_param = [detail_date, type_id, type_note, detail_note, detail_coust, id, company]
                break;

            case 'delete':
                sql = `DELETE FROM details_list WHERE id=? AND com_id = ?`
                sub_param = [id, company]
                break;

            case 'notefilter':
                sql = `
                SELECT * 
                FROM details_list 
                INNER JOIN type_list 
                ON details_list.type_id = type_list.type_id
                WHERE 1=1 AND details_list.com_id = ?`
                sub_param.push(company)

                if (date_start) {
                    sql += ` AND detail_date >= ?`
                    sub_param.push(date_start)
                }

                if (date_end) {
                    sql += ` AND detail_date <= ?`
                    sub_param.push(date_end)
                }

                if (type_note > 0) {
                    sql += ` AND details_list.type_note = ?`
                    sub_param.push(Number(type_note))

                    if (type_id > 0) {
                        sql += ` AND details_list.type_id = ?`
                        sub_param.push(Number(type_id))
                    }
                }

                sql += ` ORDER BY detail_date`
                break;

            case 'monthfilter':
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
                    WHERE 1=1 AND details_list.com_id = ?`
                sub_param.push(company)

                if (date_start) {
                    let [startYear, startMonth] = date_start.split('-');
                    sql += ` AND (YEAR(detail_date) > ? OR (YEAR(detail_date) = ? AND MONTH(detail_date) >= ?))`;
                    sub_param.push(startYear, startYear, startMonth);
                }

                if (date_end) {
                    let [endYear, endMonth] = date_end.split('-');
                    sql += ` AND (YEAR(detail_date) < ? OR (YEAR(detail_date) = ? AND MONTH(detail_date) <= ?))`;
                    sub_param.push(endYear, endYear, endMonth);
                }

                if (type_note > 0) {
                    sql += ` AND details_list.type_note = ?`;
                    sub_param.push(Number(type_note));

                    if (type_id > 0) {
                        sql += ` AND details_list.type_id = ?`;
                        sub_param.push(Number(type_id));
                    }
                }

                sql += `
                    GROUP BY 
                        type_list.type_id,
                        details_list.type_note,
                        type_list.type_name,
                        month
                    ORDER BY 
                        type_list.type_id,
                        details_list.type_note,
                        month;`

                break;
            case "yearfilter":
                sql = `
                    SELECT
                        DATE_FORMAT(detail_date, '%Y') AS year,
                        SUM(CASE WHEN type_note = 1 THEN detail_coust ELSE 0 END) AS total_income,
                        SUM(CASE WHEN type_note = 2 THEN detail_coust ELSE 0 END) AS total_expense
                    FROM 
                        details_list
                    INNER JOIN 
                        type_list ON details_list.type_id = type_list.type_id
                    WHERE 1=1 AND details_list.com_id = ?`
                sub_param.push(company)
                if (date_start) {
                    sql += ` AND YEAR(detail_date) >= ?`
                    sub_param.push(date_start.split('-')[0])
                }

                if (date_end) {
                    sql += ` AND YEAR(detail_date) <= ?`
                    sub_param.push(date_end.split('-')[0])
                }

                sql += `
                    GROUP BY 
                        year
                    ORDER BY 
                        year;`
                break;

            default:
                return res.status(400).json({ message: 'การดำเนินการไม่ถูกต้อง' })
        }

        if (!sql) {
            return res.status(400).json({ message: 'ไม่พบข้อมูล' })
        }

        const data = await new Promise((resolve, reject) => {
            conn.query(sql, sub_param, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            });
        });

        res.json({ message: 'ok', data })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }

};

module.exports = details