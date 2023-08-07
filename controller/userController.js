const User = require("../models/userModel");
const errResponse = require("../utils/errResponse");
const bcrypt = require("bcrypt");

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
    const block = User.findByIdAndUpdate(
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
module.exports = {
  signUp,
  allUsers,
  UpdateData,
  deleteUser,
  blockUser,
  unblockUser,
};
