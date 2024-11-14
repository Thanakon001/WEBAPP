const jwt = require('jsonwebtoken');
const KEY = require('../../config/app.json');

const authen_Token = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect('/login');
        }

        jwt.verify(token, KEY.JWT_SECRET, (err, user) => {
            if (err) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            if (user.exp && Date.now() >= user.exp * 1000) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            req.user = user;
            console.log(
                {
                    logApp: req.user,
                    date: new Date().toLocaleString(),
                    status: 'online request'
                }
            );
            next();
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

module.exports = authen_Token;
