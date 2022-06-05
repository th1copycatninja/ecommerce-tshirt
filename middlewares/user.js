const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isUserLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization") && req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return next(new CustomError("Not Authorized", 401));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECREAT);
  req.user = await User.findById(decodedToken.id);
  next();
});


exports.customeRole = (...roles)=>{
  return (req,res,next) =>{
    if(!roles.includes(req.user.role)){
      return next(new CustomError("you are not allowed for this resource",403))
    }
    next()
  }
}