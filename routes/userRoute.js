const router = require("express").Router();
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
const Upload = require("../utils/multer");
const {
  signUp,
  allUsers,
  UpdateData,
  deleteUser,
  blockUser,
  unblockUser,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  getAllOrders,
  getOrders,
  createOrder,
  updateOrderStatus,
  updateProfile,
} = require("../controller/userController");

router.post("/signUp", signUp);
router.get("/getUsers", [admin], allUsers);
router.put("/update", [admin, auth], UpdateData);
router.delete("/deleteUser/:userId", [admin], deleteUser);
//blocke-unblock user by admin
router.put("/blockUser/:id", [admin], blockUser);
router.put("/unBlockUser/:id", [admin], unblockUser);
router.post("/cart", [auth], userCart);
router.get("/cart", [auth], getUserCart);
router.delete("/empty-cart", [auth], emptyCart);
router.post("/cart/applycoupon", [auth], applyCoupon);
router.post("/cart/cash-order", [auth], createOrder);
router.get("/get-orders", [auth], getOrders);
router.get("/getallorders", [auth], getAllOrders);
router.post("/getorderbyuser/:id", [auth], getAllOrders);
router.put("/order/update-order/:id", [auth], updateOrderStatus);
router.put(
  "/updateProfile/:userId",
  [admin, auth],
  Upload.single("image"),
  updateProfile
);

module.exports = router;
