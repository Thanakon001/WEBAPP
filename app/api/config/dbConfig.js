const mysql = require('mysql')
const app = require('../config/app.json')

const conn = mysql.createPool(
    {
        host: app.MYSQL.HOST,
        user: app.MYSQL.USER,
        password: app.MYSQL.PASSWORD,
        database: app.MYSQL.DATABASE,
        port: app.MYSQL.PORT,
        multipleStatements: true
    }
)

conn.getConnection(err => {
    if (err) {
        console.log('mariadb not connected');
    }
})

module.exports = conn