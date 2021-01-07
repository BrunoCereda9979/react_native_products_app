const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: '¡You need to log in or create an account!'
        })
    }
}