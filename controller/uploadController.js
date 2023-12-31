const express = require('express'),
    uploadModel = require('../models/uploadModel'),
    router = express.Router();


/*

    @ Pushpendra
    API Path - "/upload/upload_files"
    Desc - Created api for upload single file
    Params - { 
                files: { uploadedFile: File }[],
                body: body
            }
    Date - 14/12/23

*/

router.post("/upload_files", async (req, res) => {
    try {
        const response = await uploadModel.uploadFiles(req);
        return res.status(response.status_code).send(response);
    } catch (err) {
        console.log("Error in {/multiple_upload} in {upload.js}, ERROR ----->>>>> \n \n", err);
        return res.status(400).json({ status: false, message: "Error in process" });
    }
});

module.exports = router;