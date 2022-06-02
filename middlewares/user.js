const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isUserLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return next(new CustomError("Not Authorized", 401));
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECREAT);
  req.user_id = decodedToken?.id
  next();
});
