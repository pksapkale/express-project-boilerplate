const express = require('express'),
    uploadHelperService = require('./uploadHelperservice'),
    router = express.Router();

/*

    @ Pushpendra
    API Path - "/upload/single_upload"
    Desc - Created api for upload single file
    Params - { 
                file: File,
                body: body 
            }
    Date - 14/12/23

*/

router.post("/single_upload", async (req, res) => {
    try {
        const response = await uploadHelperService.single_upload(req);
        return res.status(response.status_code).send(response);
    } catch (err) {
        console.log("Error in {/single_upload} in {upload.js}, ERROR ----->>>>> \n \n", err);
        return res.status(400).json({ status: false, message: "Error in process" });
    }
});

/*

    @ Pushpendra
    API Path - "/upload/multiple_upload"
    Desc - Created api for upload single file
    Params - { 
                files: File,
                body: body
            }
    Date - 14/12/23

*/

router.post("/multiple_upload", async (req, res) => {
    try {
        const response = await uploadHelperService.multiple_upload(req);
        return res.status(response.status_code).send(response);
    } catch (err) {
        console.log("Error in {/multiple_upload} in {upload.js}, ERROR ----->>>>> \n \n", err);
        return res.status(400).json({ status: false, message: "Error in process" });
    }
});

module.exports = router;