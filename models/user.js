const mongoose = require("mongoose");
const validator = require("validator");
const bcraypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [40, "Please enter at most 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
    minlength: [6, "Please should be aleast 6 characters"],
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      required:true,
    },
    secure_url: {
      type: String,
      required:true,
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//password encryption before save -hooks
userSchema.pre('save', async function (next){
    if(!this.isModified()) return next();
    this.password = await bcraypt.hash(this.password,10)
})

// validate the password which is passed by user 
userSchema.methods.isValidatedPassword = async function(userPassword){
    return await bcraypt.compare(userPassword,this.password)
}

userSchema.methods.getJwtToken = async function(){
  return jwt.sign({id:this._id},process.env.JWT_SECREAT,{
    expiresIn:process.env.JWT_EXPIRY
  })
}

//generate forgot password token

userSchema.methods.getForgotPasswordToken  = function(){
  // generate a long and random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  // getting a hash - make sure to get a hash on backend
  this.forgotPasswordToken =crypto.createHash("SHA256").update(forgotToken).digest("hex");

  // time of token
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 60 * 1000;

  return forgotToken;
}

module.exports = mongoose.model("user", userSchema);
