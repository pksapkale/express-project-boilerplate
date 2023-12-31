require('dotenv').config();
const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fileUpload = require('express-fileupload'),
    rateLimit = require('express-rate-limit'),
    helmet = require('helmet'),
    routes = require('./router'),
    limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    });

app = express();
app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))    // Here we are setting static path for folder uploads to view uploaded files
app.use(fileUpload());

// Always use routes in last
// Here in routes we have all our routing configurations
app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})