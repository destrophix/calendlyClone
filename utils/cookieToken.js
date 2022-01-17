module.exports = function cookieToken(user, res) {
  const token = user.getjwtToken();

  const options = {
    expires: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  user.password = undefined;

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
