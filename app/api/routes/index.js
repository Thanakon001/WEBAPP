const express = require('express');
const { index, authenLogin, register } = require('../controllers/indexController');
const authen_Token = require('./middleware/singinAuth');
const router = express.Router();

router.get('/', authen_Token, index);
router.get('/login', authenLogin);
router.get('/register', register);

module.exports = router;
