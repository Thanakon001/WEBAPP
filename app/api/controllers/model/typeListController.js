const conn = require("../../config/dbConfig")

const typeList = async (req, res) => {
    try {
        let sql
        let sub_param = []
        let { type_name, typenote_id, action, company, type_id } = req.body
        switch (action) {
            case 'all':
                sql = `SELECT * FROM type_list WHERE com_id = ?`
                sub_param = [company]
                break;
            case 'insert':
                sql = `INSERT INTO type_list (type_name, typenote_id,com_id) VALUES (?,?,?)`
                sub_param = [type_name, typenote_id, company]
                break;
            case 'update':
                sql = `UPDATE type_list SET type_name = ?, typenote_id = ? WHERE type_id = ? AND com_id = ?`
                sub_param = [type_name, typenote_id, type_id, company]
                break;
            case 'delete':
                sql = `DELETE FROM type_list WHERE type_id = ? AND com_id = ?`
                sub_param = [type_id, company]
                break;
            default:
                return res.status(400).json({ message: 'ดำเนินการไม่ถูกต้อง' })
        }

        if (company === 'null') {
            return res.status(200).json({ message: 'ไม่พบข้อมูลบริษัท กรุณาเพิ่มบริษัทก่อน' })
        }

        console.log(sub_param)

        const data = await new Promise((resolve, reject) => {
            return conn.query(sql, sub_param, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })
        res.json({ message: 'ok', data })
    } catch (error) {
        res.json({ message: 'error fetching', error })
    }
}

module.exports = typeList