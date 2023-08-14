const User = require("../models/userModel");
const errResponse = require("../utils/errResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const signUp = async (req, res, next) => {
  const { firstName, lastName, phone, email, confirmPassword, password } =
    req.body;

  let user = await User.findOne({ email: email });
  if (user) return next(new errResponse(`User already exists`));

  if (confirmPassword != password)
    return next(new errResponse(`Passwords do not match`));

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);

    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
      phone,
    });

    const savedUser = await user.save();
    res
      .header("x-auth-token", user.generateAuthToken())
      .status(200)
      .json(savedUser);
  } catch (error) {
    return next(new errResponse(`Error registering user: ${error.message}`));
  }
};
///get.......
const allUsers = async (req, res, next) => {
  try {
    const user = await User.find().select("email phone firstName lastName");
    if (!user) return next(new errResponse(`users Not found`));
    res.json(user);
  } catch (error) {
    next(error);
  }
};
const UpdateData = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { firstName, lastName } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return next(new errResponse("user not found"));
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    await user.save();
    res.status(200).json({ message: "profile data updated success", user });
  } catch (err) {
    next(err);
  }
};
const blockUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    User.findByIdAndUpdate(
      id,
      {
        isBlock: true,
      },
      {
        new: true,
      }
    );
    res.json({ message: "userBlocked" });
  } catch (error) {}
};
const unblockUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const block = User.findByIdAndUpdate(
      id,
      {
        isBlock: false,
      },
      {
        new: true,
      }
    );
    res.json({ message: "userBlocked" });
  } catch (error) {}
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndRemove(userId);
    res.status(200).json({ nessage: "delte user succefully" });
  } catch (error) {}
};
const userCart = async (req, res, next) => {
  const { cart } = req.body;
  const { _id } = req.user;
  try {
    let products = [];
    const user = await User.findById(_id);
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (err) {
    next(err);
  }
};
const getUserCart = async (req, res) => {
  const id = req.user.id;

  try {
    const cart = await Cart.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
};
const emptyCart = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await User.findOne({ id });
    const cart = await Cart.findOneAndRemove({ orderby: user.id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = {
  signUp,
  allUsers,
  UpdateData,
  deleteUser,
  blockUser,
  unblockUser,
  userCart,
  getUserCart,
  emptyCart,
};
