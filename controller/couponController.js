const Coupon = require("../models/couponModel");
const errResponse = require("../utils/errResponse");
const createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
};
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
};
const updateCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatecoupon);
  } catch (error) {
    throw new Error(error);
  }
};
// const deleteCoupon = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletecoupon = await Coupon.findByIdAndDelete(id);
//     if (deletecoupon) return new errResponse(`deleted already`);
//     res.status(200).json({ message: "deleted coupon" });
//   } catch (error) {
//     throw new Error(error);
//   }
// };
const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const deletecoupon = await Coupon.findByIdAndDelete(id);
    if (!deletecoupon) {
      // Coupon not found, return "not found" message
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Deleted coupon" });
  } catch (error) {
    throw new Error(error);
  }
};
const getCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const getAcoupon = await Coupon.findById(id);
    res.json(getAcoupon);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
};
