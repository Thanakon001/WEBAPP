const conn = require("../../config/dbConfig")
const type_note = async (req, res) => {
    try {
        let sql = ''
        if (req.body.action === 'all') {
            sql = 'SELECT * FROM typenote_list'
        }

        const data = await new Promise((resolve, reject) => {
            return conn.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })

        res.json({ data })

    } catch (error) {
        console.log(error);
        res.json({ message: 'เกิดข้อผิดพลาด', error })
    }
}

module.exports = type_note