const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        req.flash('error_msg', 'Please log in to access this resource.');
        return res.redirect('/');
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            req.flash('error_msg', 'Invalid or expired session. Please log in again.');
            return res.redirect('/');
        }
        req.user = user;
        next();
    });
};
