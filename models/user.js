const mongoose = require("mongoose");
const validator = require("validator");
const bcraypt = require("bcryptjs");

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
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
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

module.exports = mongoose.model("user", userSchema);
