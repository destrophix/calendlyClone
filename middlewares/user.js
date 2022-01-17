const bigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isLoggedIn = bigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new Error("no token provided"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new Error("token is invalid"));
  }

  req.user = user;
  next();
});
