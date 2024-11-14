const express = require('express');
const authen_Token = require('./middleware/singinAuth');
const router = express.Router();
const details = require('../controllers/model/detailsController')
const type_note = require('../controllers/model/typenoteController')
const typeList = require('../controllers/model/typeListController')
const company = require('../controllers/model/companyController')
const dataReport = require('../controllers/model/datareportController');
const { user } = require('../controllers/model/userController');
const { upload } = require('./middleware/multerUpload');

//data get all
router.post('/details', authen_Token, details);
router.post('/typenote', authen_Token, type_note);
router.post('/typelist', authen_Token, typeList);
router.post('/company', authen_Token, company);
router.post('/user', authen_Token, upload.single('user_image'), user);
//data report
router.post('/datareport', authen_Token, dataReport);

module.exports = router;
