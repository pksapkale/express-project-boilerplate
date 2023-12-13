/*
    This is for authentication requests
    Here we are checking whether user is sending correct token or not
    Also we will check user is authorized to use particular API or not
    If token is valid and user is authorized to API then we will proceed further otherwise we will return the request with invalid token response 
*/

const jwt = require('jsonwebtoken');
const pool = require('./db/connection');
const apiRole = require('./apiRole');


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    const reqURL = req.originalUrl;

    if (!token) {
        return res.status(401).json({ status: false, message: 'Access denied. Token not provided.' });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, user) => {
        if (err) {
            return res.status(403).json({ status: false, message: err.message });
        }
        if (!await checkTokenInDB(user, token)) {
            return res.status(401).json({ status: false, message: "User is not authorized to particular service" });
        }
        if (!checkAuthorization(user.user_type, reqURL)) {
            return res.status(401).json({ status: false, message: "User is not authorized to particular service" });
        }
        req.user = user;
        next();
    });

    async function checkTokenInDB(user, token) {
        let query = `SELECT * FROM users WHERE user_id = ? AND user_type = ? AND token = ?`;
        const [updateData] = await pool.query(query, [user.user_id, user.user_type, token]);
        if (updateData && updateData.length) {
            return true;
        }
        else {
            return false;
        }
    }

    function checkAuthorization(user_type, apiURL) {
        let apiName = apiURL.substring(1);
        return apiRole[apiName].includes(user_type) ? true : false;
    }

};



module.exports = authenticateToken;