const express = require('express'),
  authControl = require('./controller/authController'),
  uploadControl = require('./controller/uploadController'),
  authenticateToken = require('./authenticateToken'),
  router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Server Is Working Perfectly !!<h1/>");
});

router.use("/auth", authControl);  // All the api's regarding auth here we do not require token

/*

The apis which you want to 
Run without token validation should be here
Before router.use(authenticateToken); 

*/

router.use(authenticateToken);  // Here we are validating all the token

router.use("/upload", uploadControl);  // All the api's regarding auth here we do not require token


/*

  The apis which you want to 
  Run after token validation should be here
  After router.use(authenticateToken); 

*/



module.exports = router;