const app = require('./app');
const mongoDbConnect = require('./config/db');
const cloudinary = require('cloudinary');
require('dotenv').config();

mongoDbConnect();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
app.listen(process.env.PORT,()=>{
    console.log(`server is running at ${process.env.PORT}`);
})