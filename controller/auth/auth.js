const express = require('express'),
    authHelperService = require('./authHelperService'),
    router = express.Router();


/*
 
    @ Pushpendra
    API Path - "/auth/signup"
    Desc - Created api for user signup
    Params - { 
                user_type: string,
                user_first_name: string,  
                user_last_name: string,
                user_email: string, 
                user_phone: number(10 digits),
                password: string,
              }
    Date - 13/12/23
 
*/

router.post("/signup", async (req, res) => {
    try {
        const { body } = req,
            response = await authHelperService.signup(body);
        return res.status(response.status_code).send(response);
    } catch (err) {
        console.log("Error in {/signup} in {authHelper.mjs}, ERROR ----->>>>> \n \n", err);
        return res.status(400).json({ status: false, message: "Error in process" });
    }
});

/*

    @ Pushpendra
    API Path - "/auth/login"
    Desc - Created api for user login
    Params - { 
                user_type: string,
                user_email: string, 
                password: string,
              }
    Date - 13/12/23

*/

router.post("/login", async (req, res) => {
    try {
        const { body } = req,
            response = await authHelperService.login(body);
        return res.status(response.status_code).send(response);
    } catch (err) {
        console.log("Error in {/login} in {authHelper.mjs}, ERROR ----->>>>> \n \n", err);
        return res.status(400).json({ status: false, message: "Error in process" });
    }
});

/*

    @ Pushpendra
    API Path - "/auth/re_gen_token"
    Desc - Created api for user to generate token from refresh token
    Params - { 
                refresh_token: string
              }
    Date - 13/10/23

*/

router.post("/re_gen_token", async (req, res) => {
    try {
        const { body } = req,
            response = await authHelperService.re_gen_token(body);
        return res.status(response.status_code).send(response);
    } catch (err) {
        console.log("Error in {/re_gen_token} in {authHelper.mjs}, ERROR ----->>>>> \n \n", err);
        return res.status(400).json({ status: false, message: "Error in process" });
    }
});

module.exports = router;