const { User } = require("../models/userModel");
const errResponse = require("../utils/errResponse");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const login = async (req, res, next) => {
  const { error } = validatex(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message));

  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return next(new errResponse(`User not found`));

  const passwordValid = bcrypt.compare(password, user.password);
  if (!passwordValid) return next(new errResponse(`email or pass invalid`));
  res.json(user.generateAuthToken());
};

const validatex = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,}$")),
  });

  return schema.validate(user);
};
module.exports = {
  login,
};
