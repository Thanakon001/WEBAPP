const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authenController');
const { user } = require('../controllers/model/userController');

router.post('/login', login);
router.post('/register', user);

router.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/login')
});

module.exports = router;
