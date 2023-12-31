const { User, validateUser } = require("../models/userModel");
const errResponse = require("../utils/errResponse");
const bcrypt = require("bcrypt");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

const signUp = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) return next(new ErrorResponse(error.details[0].message));

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
    User.findByIdAndUpdate(
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
  const { id } = req.user;
  try {
    let products = [];
    const user = await User.findById(id);
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
const applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const userId = req.user.id;

  const validCoupon = await Coupon.findOne({ name: coupon });
  if (!validCoupon) {
    throw new Error("Invalid Coupon");
  }

  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new Error("User not found");
  }

  const cart = await Cart.findOne({ orderby: user._id }).populate(
    "products.product"
  );
  if (!cart) {
    throw new Error("Cart not found");
  }

  let { cartTotal } = cart;
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json(totalAfterDiscount);
};

// const applyCoupon = async (req, res) => {
//   const { coupon } = req.body;
//   const userId = req.user.id;
//   console.log("id", req.user.id);
//   const validCoupon = await Coupon.findOne({ name: coupon });
//   if (validCoupon === null) {
//     throw new Error("Invalid Coupon");
//   }
//   const user = await User.findOne({ userId });
//   console.log(user);
//   let { cartTotal } = await Cart.findOne({
//     orderby: user._id,
//   }).populate("products.product");
//   let totalAfterDiscount = (
//     cartTotal -
//     (cartTotal * validCoupon.discount) / 100
//   ).toFixed(2);
//   await Cart.findOneAndUpdate(
//     { orderby: user._id },
//     { totalAfterDiscount },
//     { new: true }
//   );
//   res.json(totalAfterDiscount);
// };

const createOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;

  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
};

const getOrders = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
};
const getOrderByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
};
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    const cloudinaryOptions = {
      folder: `/usersProfiles/${user._id}`,
      quality: "auto:low", // Set the quality to low
      transformation: [
        { width: 300, height: 300, crop: "limit" }, // Resize the image to a smaller size
      ],
    };

    const cloudinaryResponse = await Cloudinary.uploader.upload(
      req.file.path,
      cloudinaryOptions
    );

    console.log(req.file);

    const updateUser = user;
    if (updateUser.profileimg) {
      updateUser.profileimg.public_id = cloudinaryResponse.public_id;
      updateUser.profileimg.url = cloudinaryResponse.url;
    } else {
      updateUser.profileimg = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      };
    }

    await updateUser.save();
    res.status(200).json({
      message: "Profile image updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signUp,
  allUsers,
  UpdateData,
  updateOrderStatus,
  deleteUser,
  blockUser,
  unblockUser,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  getOrderByUserId,
  getAllOrders,
  getAllOrders,
  createOrder,
  getOrders,
  updateProfile,
};
