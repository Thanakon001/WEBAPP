const conn = require("../../config/dbConfig")

const company = async (req, res) => {
    try {
        let sql
        let sub_param = []
        let { action, com_name, com_details, com_id } = req.body
        console.log(com_id);
        switch (action) {
            case 'all':
                sql = 'SELECT * FROM company_list WHERE user_id = ?'
                sub_param.push(req.user.userId)
                break;

            case 'insert':
                if (!com_name) {
                    return res.status(400).json({ message: 'กรุณากรอกชื่อบริษัท' })
                }
                sql = 'INSERT INTO company_list (com_name, com_details, user_id) VALUES (? , ?, ?)'
                sub_param = [com_name, com_details, req.user.userId]
                break;

            case 'update':
                if (!com_name || !com_id) {
                    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
                }
                sql = 'UPDATE company_list SET com_name = ? ,com_details = ? WHERE company_list.com_id = ? AND user_id = ?;'
                sub_param = [com_name, com_details, com_id, req.user.userId]
                break;

            case 'delete':
                if (!com_id) {
                    return res.status(400).json({ message: 'การดำเนินการไม่ถูกต้อง' })
                }

                let checkdata = await new Promise((resolve, reject) => {
                    conn.query('SELECT * FROM details_list WHERE com_id = ?', [com_id], (err, result) => {
                        if (err) reject(err)
                        resolve(result)
                    })
                })

                if (checkdata.length > 0) {
                    res.status(200).json(
                        { message: 'ข้อมูลนี้ถูกใช้งานอยู่' }
                    )
                    return
                }

                sql = 'DELETE FROM company_list WHERE company_list.com_id = ? AND company_list.user_id = ?;'
                sub_param = [com_id, req.user.userId]
                break;

            default:
                return res.status(400).json({ message: 'การดำเนินการไม่ถูกต้อง' })
        }

        if (!sql) {
            return res.status(400).json({ message: 'ไม่พบข้อมูล' })
        }

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
        console.error(error)
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message })
    }
}

module.exports = company