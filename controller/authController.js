const User = require("../models/userModel");
const errResponse = require("../utils/errResponse");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return next(new errResponse(`User not found`));

  const passwordValid = bcrypt.compare(password, user.password);
  if (!passwordValid) return next(new errResponse(`email or pass invalid`));
  res.json(user.generateAuthToken());
};

module.exports = {
  login,
};
