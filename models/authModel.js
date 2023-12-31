const pool = require('../db/connection'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

const authModel = {

    /*
   
      @ Pushpendra
      Method Name - {userSignup}
      Desc - Created method for signup user
      Date - 13/12/23
   
    */

    signup: async function (body) {
        const newUser = this.getUserDetails(body);    // Creating new user object adding user information in here

        const { isEmailExists } = await this.checkEmailExists(newUser.user_email);   // Checking whether email already exists or not
        if (isEmailExists) {
            return { status: false, status_code: 400, message: "Email is already exists !!", data: [] };
        }

        const { isPhoneExists } = await this.checkPhoneExists(newUser.user_phone);   // Checking whether phone already exists or not
        if (isPhoneExists) {
            return { status: false, status_code: 400, message: "Phone no is already exists !!", data: [] };
        }

        const hashPassword = await bcrypt.hash(newUser.password, 10);  // Here we are hashing the {user_password}
        newUser['password'] = hashPassword; // Replacing password with hash password

        let insertQuery = "INSERT INTO users SET ?";  // Creating new user with hash password here
        const [rows] = await pool.query(insertQuery, newUser);

        const { token, refresh_token } = await this.setTokenRefToken(rows.insertId, body.user_type); // Here we are setting token and refresh token in to database

        return { status: true, status_code: 200, message: "User inserted successfully", data: { token, refresh_token, user_id: rows.insertId } }
    },

    /*
   
      @ Pushpendra
      Method Name - {userLogin}
      Desc - Created method for login user
      Date - 13/05/23
   
    */

    login: async function (body) {
        let user = body;
        const { isEmailExists, userData } = await this.checkEmailExists(body.user_email);   // Checking whether email already exists or not
        if (!isEmailExists) {
            return { status: false, status_code: 400, message: "Email not exists !!", data: [] }
        }
        else {
            let passCheck = await bcrypt.compare(user.password, userData[0].password);  // Validating password here
            if (body.user_type != userData[0].user_type) {
                return { status: false, status_code: 400, message: "Invalid Password !!", data: [] }
            }
            if (!passCheck) {
                return { status: false, status_code: 400, message: "Invalid Password !!", data: [] }
            }
            const { token, refresh_token } = await this.setTokenRefToken(userData[0].user_id, body.user_type); // Setting new token and refresh token here
            return { status: true, status_code: 200, message: "User logged in successfully", data: { token, refresh_token, user_id: userData[0].user_id } };
        }
    },

    /*
    
      @ Pushpendra
      Method Name - {re_get_token}
      Desc - Created method for regenerate token
      Date - 13/05/23
    
    */

    re_gen_token: async function (body) {
        let user = body;
        let checkRefToken = await this.checkRefreshToken(user.refresh_token); // Validating refresh token
        if (!checkRefToken.status) {  // If token is invalid
            return { status: false, status_code: 400, message: checkRefToken.message, data: [] };
        }
        const { token, refresh_token } = await this.setTokenRefToken(checkRefToken.user_id, checkRefToken.user_type);
        return { status: true, status_code: 200, message: "New Token Setted Successfully", data: { token, refresh_token } }
    },

    /*
   
      @ Pushpendra
      Method Name - {setTokenRefToken}
      Desc - Created method for setting refresh token and token into db
      Date - 13/05/23
   
    */

    async setTokenRefToken(user_id, user_type) {
        let token = jwt.sign({ user_id: user_id, user_type: user_type }, process.env.TOKEN_KEY, { expiresIn: '5h' });  // Token will expire in 1 hour
        let refresh_token = jwt.sign({ user_id: user_id, user_type: user_type }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '10d' });  // Ref Token will expire in 90 days
        let updateQuery = "UPDATE users SET ? WHERE user_id = ?"; // Setting token and refresh token here
        const [updateData] = await pool.query(updateQuery, [{ token, refresh_token }, user_id]);
        return { token, refresh_token };
    },

    /*
   
      @ Pushpendra
      Method Name - {getUserDetails}
      Desc - Created method for returning user details according body data
      Date - 13/12/23
   
    */

    getUserDetails: function (body) {
        return {
            user_first_name: body.user_first_name,
            user_type: body.user_type,
            user_last_name: body.user_last_name,
            user_email: body.user_email,
            user_phone: body.user_phone,
            password: body.password,
            token: null,  // We will assign it after creating user
            refresh_token: null,  // We will assign it after creating user
            created_on: new Date().getTime(),
            modified_on: new Date().getTime()
        };
    },

    /*
   
      @ Pushpendra
      Method Name - {checkEmailExists}
      Desc - Created method for checking whether email is already existing or not
      Date - 13/05/23
   
    */

    checkEmailExists: async function (user_email) {
        const [rows] = await pool.query(`SELECT * FROM users WHERE user_email = ?`, [user_email]);
        return {
            isEmailExists: rows.length > 0 ? true : false,
            userData: rows
        };   // If we got email then we will send true
    },

    /*
   
      @ Pushpendra
      Method Name - {checkPhoneExists}
      Desc - Created method for checking whether email is already existing or not
      Date - 13/05/23
   
    */

    checkPhoneExists: async function (user_phone) {
        const [rows] = await pool.query(`SELECT * FROM users WHERE user_phone = ?`, [user_phone]);
        return {
            isPhoneExists: rows.length > 0 ? true : false,
            userData: rows
        };   // If we got email then we will send true
    },


    /*
   
      @ Pushpendra
      Method Name - {checkRefreshToken}
      Desc - Created method for validate refresh token
      Date - 13/05/23
   
    */

    async checkRefreshToken(refresh_token) {
        try {
            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY); // Here verify the refresh token
        }
        catch (err) {
            return { status: false, message: err.message };
        }

        const [rows] = await pool.query(`SELECT * FROM users WHERE refresh_token = ?`, [refresh_token]);
        if (rows.length == 0) {
            return { status: false, message: 'Refresh token is not found in DB' };
        }
        else {
            return { status: true, user_id: rows[0].user_id, user_type: rows[0].user_type };
        }
    },

}

module.exports = authModel;