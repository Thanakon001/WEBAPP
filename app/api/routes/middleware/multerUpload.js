const multer = require('multer')
const path = require('path')

const uploadDir = path.join(__dirname, '../../../public/upload/')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('รองรับเฉพาะไฟล์รูปภาพเท่านั้น'), false)
        }
        cb(null, true)
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

module.exports = { upload }