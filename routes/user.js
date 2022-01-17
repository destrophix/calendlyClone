const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middlewares/user");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getUserDetails,
  logout,
} = require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);
router.route("/dashboard").get(isLoggedIn, getUserDetails);

module.exports = router;
