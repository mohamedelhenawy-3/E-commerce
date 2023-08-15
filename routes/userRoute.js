const router = require("express").Router();
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
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
} = require("../controller/userController");

router.post("/signUp", signUp);
router.get("/getUsers", [admin], allUsers);
router.put("/update", UpdateData);
router.delete("/deleteUser/:userId", [admin], deleteUser);
//blocke-unblock user by admin
router.put("/blockUser/:id", [admin], blockUser);
router.put("/unBlockUser/:id", [admin], unblockUser);
router.post("/cart", [auth], userCart);
router.get("/cart", [auth], getUserCart);
router.delete("/empty-cart", [auth], emptyCart);
router.post("/cart/applycoupon", applyCoupon);
router.post("/cart/cash-order", createOrder);
router.get("/get-orders", getOrders);
router.get("/getallorders", getAllOrders);
router.post("/getorderbyuser/:id", getAllOrders);
router.put("/order/update-order/:id", updateOrderStatus);

module.exports = router;
