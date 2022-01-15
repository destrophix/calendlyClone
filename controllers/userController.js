const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");

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

  res.status(200).json({
    success: true,
    user,
  });
});
