const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken")
const cloudinary = require("cloudinary");
const User = require("../models/user");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  
  console.log(req.body,req.files)
  if (!name || !email || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }
  if(!req.files){
    return next(new CustomError("Please upload a photo", 400));
  }
  let result;
  if(req.files){
    
    let file = req.files.photo;
    result   = await cloudinary.v2.uploader.upload(file.tempFilePath,{
      folder:"users",
      width:"150",
      crop:"scale",
    })
  }

  if (!name || !email || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id:result.public_id,
      secure_url:result.secure_url
    }
  });

  CookieToken(user, res);
});
