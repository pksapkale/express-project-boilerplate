const express = require('express');
require('dotenv').config();
const cors = require('cors'),
    bodyParser = require('body-parser'),
    path = require('path'),
    routes = require('./router');

app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/static', express.static(path.join(__dirname, 'public')))

// Always use routes in last
// Here in routes we have all our routing configurations
app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})