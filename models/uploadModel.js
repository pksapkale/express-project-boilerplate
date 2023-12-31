const pool = require('../db/connection'),
    fs = require('fs'),
    uniqid = require("uniqid");

const uploadModel = {

    /*
 
        @ Pushpendra
        Method Name - {uploadFiles}
        Desc - Created method for upload multiple file
        Date - 14/12/23
 
    */

    uploadFiles: async function (req) {
        if (!req.files || Object.keys(req.files).length === 0) {    // Check if files were uploaded
            return { status: false, status_code: 400, message: "No Files Were Uploaded !!", data: [] };
        }

        const files = Array.isArray(req.files.uploadedFiles) ? req.files.uploadedFiles : [req.files.uploadedFiles]; // Use 'uploadedFiles' if you have a field for multiple files in your form
        const uploadFolderPath = __dirname + '/../uploads';   // Got path of uploads folder

        if (!fs.existsSync(uploadFolderPath)) {   // Call the function to ensure 'uploads' folder exists
            fs.mkdirSync(uploadFolderPath);
        }

        const uploadResults = [];

        // Process each file asynchronously
        await Promise.all(files.map(async (file) => {
            const uploadPath = `${uploadFolderPath}/${uniqid()}_${file.name}`;   // Specify the path where the file will be saved

            try {
                await file.mv(uploadPath);  // Move the file to the specified path
                uploadResults.push({ filename: file.name, path: uploadPath });
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                uploadResults.push({ filename: file.name, error: 'Failed to upload' });
            }
        }));

        return { status: true, status_code: 200, message: "Files Uploaded Successfully", data: uploadResults };
    },
}

module.exports = uploadModel;