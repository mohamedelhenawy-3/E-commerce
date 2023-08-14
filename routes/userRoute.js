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
module.exports = router;
