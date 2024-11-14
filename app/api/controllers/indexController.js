const index = (req, res) => {
    try {
        res.render('desktop');
    } catch (err) {
        console.error(err);

        res.status(500).json(
            {
                message: err.message
            }
        );
    }
}

const authenLogin = (req, res) => {
    try {
        res.render('desktopAuthen');
    } catch (err) {
        console.error(err);
        res.status(500).json(
            {
                message: err.message
            }
        );
    }
}

const register = (req, res) => {
    try {
        res.render('desktopRegister');
    } catch (err) {
        console.error(err);
        res.status(500).json(
            {
                message: err.message
            }
        );
    }
}

module.exports = {
    index,
    authenLogin,
    register
}