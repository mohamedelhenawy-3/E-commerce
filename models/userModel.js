const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
  },
  phone: {
    type: Number,
    required: false,
    minlength: 1,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    validate: {
      validator: (v) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1500,
  },
  confirmPassword: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1500,
  },
  profileimg: {
    public_id: {
      //
      type: String,
      default: " ",
    },
    url: {
      type: String,
      default: " ",
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  profileimg: {
    public_id: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});
const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required().min(1).max(255),
    phone: Joi.string().required().pattern(new RegExp("^01\\d{9}$")),
    lastName: Joi.string().required().min(1).max(255),
    email: Joi.string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    //assword must contain at least one letter ([A-Za-z]) and one digit (\\d), and must be at least 5 characters long ({5,}).
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,}$")),
    confirmPassword: Joi.string().required(),
    cloudinary_id: Joi.string(),
    url: Joi.string(),
    isAdmin: Joi.boolean(),
    resetPasswordToken: Joi.string(),
    resetPasswordExpires: Joi.date(),
    createdAt: Joi.date(),
  });

  return schema.validate(user);
};

userSchema.methods.generateAuthToken = function () {
  //return token idd and when admin it will return id and isAdmin:true
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, "privateKey"); //returns token
};

module.exports = {
  User: mongoose.model("User", userSchema),
  validateUser: validateUser,
};
