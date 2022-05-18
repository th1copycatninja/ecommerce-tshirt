const express = require('express');
require('dotenv').config();
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

// for swagger documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocumentation = YAML.load("./swagger.yaml");
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocumentation));

// regular middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//cookie and file middlware
app.use(cookieParser());
app.use(fileupload())

//morgan middlware
app.use(morgan('tiny'));

//import all routes here
const home = require('./routes/Home');

//router middleware
app.use('/api/v1',home);


module.exports = app;