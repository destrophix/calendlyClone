const crypto = require("crypto");
const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
const cookieToken = require("../utils/cookieToken");
const mailHelpter = require("../utils/emailHelper");

exports.signup = bigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new Error("Name, email and password are mandatory"));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new Error("Email already exists"));
  }

  user = await User.create({
    name,
    email,
    password,
  });

  res.status(200).send({
    success: true,
    user,
  });
});

exports.login = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("email and password are mandatory"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Error("You are not registered"));
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);
  if (!isPasswordCorrect) {
    return next(new Error("wrong password"));
  }

  cookieToken(user, res);
});

exports.logout = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    msg: "logout successful",
  });
});

exports.forgotPassword = bigPromise(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new Error("email is necessary."));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new Error("user does not exists"));
  }

  const token = user.getPasswordToken();
  await user.save({ validateBeforeSave: false });

  let myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetPassword/${token}`;

  const msg = `copy and paste this link in your address bar and hit enter ${myUrl}`;

  try {
    await mailHelpter({
      email: user.email,
      subject: "calendlyclone - Password reset email",
      msg,
    });

    res.status(200).json({
      token,
      success: true,
      msg: "instructions to reset password has been sent to your registered email",
    });
  } catch (err) {
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpiry = undefined),
      await user.save({ validateBeforeSave: false });

    return next(err);
  }
});

exports.resetPassword = bigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: encryptedToken,
    resetPasswordExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new Error("token is invalid"));
  }

  if (
    !req.body.password ||
    !req.body.confirmPassword ||
    req.body.password !== req.body.confirmPassword
  ) {
    return next(new Error("password and confirmPassword do not match."));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpirty = undefined;

  await user.save();

  cookieToken(user, res);
});

exports.getUserDetails = bigPromise(async (req, res, next) => {
  res.status(200).json({
    user: req.user,
  });
});
