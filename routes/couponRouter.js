const express = require("express");
const admin = require("../middlware/isAdmin");
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const router = express.Router();

router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.get("/:id", [admin], getAllCoupons);
router.put("/:id", [admin], updateCoupon);
router.delete("/:id", [admin], deleteCoupon);

module.exports = router;
