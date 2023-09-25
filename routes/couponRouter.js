const express = require("express");
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getCoupon,
} = require("../controller/couponController");
const router = express.Router();

router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.get("/:id", getCoupon);
router.put("/:id", [auth, admin], updateCoupon);
router.delete("/:id", [auth, admin], deleteCoupon);

module.exports = router;
