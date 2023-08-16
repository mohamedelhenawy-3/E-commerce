const express = require("express");
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const router = express.Router();

router.post("/", [auth, admin], createCoupon);
router.get("/", [auth, admin], getAllCoupons);
router.get("/:id", [auth, admin], getAllCoupons);
router.put("/:id", [auth, admin], updateCoupon);
router.delete("/:id", [auth, admin], deleteCoupon);

module.exports = router;
