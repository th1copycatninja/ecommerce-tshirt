const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/mailHelper");
const User = require("../models/user");

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
  await user.set({ validateBeforeSave: false });
  try {
    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${forgotToken}`;
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
