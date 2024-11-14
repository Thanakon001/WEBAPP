const conn = require('../../api/config/dbConfig')
const jwt = require('jsonwebtoken')
const KEY = require('../../api/config/app.json')

const login = async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: 'รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง'
            });
        }

        const sql = 'SELECT user_id FROM users WHERE user_email = ? AND user_password = ?';
        const data = await new Promise((resolve, reject) => {
            conn.query(sql, [username, password], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    reject(new Error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล'));
                }
                resolve(result);
            });
        });

        if (!data || data.length === 0) {
            return res.status(401).json({
                message: 'รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง'
            });
        }

        let company_id = null;
        try {
            const company = await new Promise((resolve, reject) => {
                conn.query("SELECT * FROM company_list WHERE user_id = ?", [data[0].user_id], (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        reject(new Error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล'));
                    }
                    resolve(result);
                });
            });
            
            if (company && company.length > 0) {
                company_id = company[0].com_id;
            }
        } catch (error) {
            console.error('Company fetch error:', error);
        }

        const token = jwt.sign(
            { userId: data[0].user_id },
            KEY.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const timeLimit = 24 * 60 * 60 * 1000;
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: timeLimit
        });

        return res.status(200).json({
            message: 'ok',
            token: company_id
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง'
        });
    }
}

module.exports = { login }