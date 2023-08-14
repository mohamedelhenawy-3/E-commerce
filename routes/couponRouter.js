const express = require("express");
const admin = require("../middlware/isAdmin");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const router = express.Router();

router.post("/", [admin], createCoupon);
router.get("/", [admin], getAllCoupons);
router.get("/:id", [admin], getAllCoupons);
router.put("/:id", [admin], updateCoupon);
router.delete("/:id", [admin], deleteCoupon);

module.exports = router;
