const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/mailHelper");
const User = require("../models/user");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  console.log(req.body, req.files);
  if (!name || !email || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }
  if (!req.files) {
    return next(new CustomError("Please upload a photo", 400));
  }
  let result;
  if (req.files) {
    let file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: "150",
      crop: "scale",
    });
  }

  if (!name || !email || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  CookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Email or Password is required"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("You are not registered"));
  }

  //match the password
  const isPassword = await user.isValidatedPassword(password);

  console.log(isPassword);
  //if password do not match
  if (!isPassword) {
    return next(new CustomError("email or password is not valid"));
  }

  CookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: true,
    msg: "logout succesfully",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    next(new CustomError("Email not found"));
  }
  const forgotToken = await user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });
  try {
    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;
    const message = `please hit this url ${myUrl}`;
    await mailHelper({
      toMail: user.email,
      subject: "tstore password reset email",
      message,
    });
    res.status(200).json({ success: true, message: "email send succesfully" });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(error?.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryptToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    next(new CustomError("Token is invalid or expired", 400));
  }

  if (password !== confirmPassword) {
    next(new CustomError("Password and confirmPassword are not the same", 400));
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

exports.getLoggedInUserDetail = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user_id);
  if (!user) {
    return next(new CustomError("User not found or user is unauthrized"));
  }

  res.status(200).json({
    status: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user_id).select("+password");

  const isOldPasswordCorrect = await user.isValidatedPassword(
    req.body.oldPassword
  );
  if (!isOldPasswordCorrect) {
    return next(new CustomError("old password is incorrect"));
  }

  user.password = req.body.newPassword;
  await user.save();

  CookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {

  // change this route post to patch , so user can send not all data, but only required data
  if (!req.body.name) {
    return next(new CustomError("Please send user name"));
  }

  if (!req.body.email) {
    return next(new CustomError("Please send user email"));
  }

  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.files) {
    const user = await User.findById(req.user_id);
    const imageId = user.photo.id;
    const res = await cloudinary.v2.uploader.destroy(imageId);
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: "150",
      crop: "sclae",
    });
    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user_id, newData, {
    new: true,
    runValidators: true,
  });

  console.log(user);

  res.status(200).json({
    status: true,
    user,
  });
});
