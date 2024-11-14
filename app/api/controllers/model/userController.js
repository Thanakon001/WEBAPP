const conn = require('../../config/dbConfig')

const user = async (req, res) => {
    try {
        let sql = ''
        let sub_param = []
        let user_image = req.file ? req.file : null
        let { user_id, user_name, user_email, user_password, user_address, action } = req.body

        switch (action) {
            case 'all':
                sql = `SELECT * FROM users WHERE user_id = ?`
                sub_param.push(req.user.userId)
                break;
            case 'insert':
                // ตรวจสอบข้อมูลที่จำเป็น
                if (!user_name || !user_email || !user_password) {
                    let data = { user_id, user_name, user_email, user_password, user_address, action }
                    return res.status(400).json({
                        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                        data
                    })
                }
                // ตรวจสอบ email ซ้ำ
                const checkEmail = await new Promise((resolve, reject) => {
                    conn.query('SELECT user_id FROM users WHERE user_email = ?', [user_email], (err, result) => {
                        if (err) reject(err)
                        resolve(result)
                    })
                })

                if (checkEmail.length > 0) {
                    return res.status(400).json({
                        message: 'อีเมลนี้ถูกใช้งานแล้ว'
                    })
                }

                sql = `INSERT INTO users (user_name, user_email, user_password, user_address) VALUES (?, ?, ?, ?)`
                sub_param = [user_name, user_email, user_password, user_address]
                break;

            case 'update':
                if (!user_id) {
                    return res.status(400).json({
                        message: 'ไม่พบข้อมูลผู้ใช้'
                    })
                }

                // ตรวจสอบรหัสผ่านเฉพาะเมื่อมีการส่งรหัสผ่านมา
                if (user_password) {
                    let checkpassword = await new Promise((resolve, reject) => {
                        conn.query('SELECT user_password FROM users WHERE user_id = ?', [req.user.userId], (err, result) => {
                            if (err) reject(err)
                            resolve(result)
                        })
                    })

                    if (checkpassword[0].user_password !== user_password) {
                        return res.status(400).json({
                            message: 'รหัสผ่านไม่ถูกต้อง'
                        })
                    }
                }

                // แก้ไขบัค: ใช้ user_id แทน req.user.userId ในการอัพเดท
                sql = `UPDATE users SET user_name = ?, user_email = ?, user_address = ? WHERE user_id = ?`
                sub_param = [user_name, user_email, user_address,  req.user.userId]

                // อัพเดทรูปภาพถ้ามีการอัพโหลด
                if (user_image) {
                    sql = `UPDATE users SET user_name = ?, user_email = ?, user_address = ?, user_image = ? WHERE user_id = ?`
                    sub_param = [user_name, user_email, user_address, user_image.filename, req.user.userId]
                }
                break;

            case 'password':
                sql = `UPDATE users SET user_password = ? WHERE user_id = ?`
                sub_param.push(user_password, req.user.userId)
                break;

            default:
                return res.status(400).json({
                    message: 'การดำเนินการไม่ถูกต้อง'
                })
        }

        let data = await new Promise((resolve, reject) => {
            conn.query(sql, sub_param, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })

        return res.status(200).json({
            message: 'ok',
            user_image: user_image ? user_image.filename : null,
            data
        })

    } catch (error) {
        console.error('Error:', error)
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง'
        })
    }
}

module.exports = { user }