const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
  },

  email: {
    type: String,
    required: [true, "Please enter your email."],
    validate: [validator.isEmail, "Please enter valid email"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please enter your password."],
    minlength: [6, "Password must be atleast 6 characters long."],
    select: false,
  },

  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpiry: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isValidatedPassword = async function (userSendPassword) {
  return await bcrypt.compare(userSendPassword, this.password);
};

userSchema.methods.getjwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

userSchema.methods.getPasswordToken = function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
