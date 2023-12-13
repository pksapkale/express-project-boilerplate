/*
    This is for authentication requests
    Here we are checking whether user is sending correct token or not
    Also we will check user is authorized to use particular API or not
    If token is valid and user is authorized to API then we will proceed further otherwise we will return the request with invalid token response 
*/

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ status: false, message: 'Access denied. Token not provided.' });
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ status: false, message: err.message });
        }
        // if() {
        //     return res.status(401).json({ status: false, message: "User is not authorized to particular service" });
        // }
        req.user = user;
        next();
    });
};



module.exports = authenticateToken;