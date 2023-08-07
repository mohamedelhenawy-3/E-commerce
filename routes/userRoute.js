const router = require("express").Router();
const isAdmin = require("../middlware/isAdmin");
const {
  signUp,
  allUsers,
  UpdateData,
  deleteUser,
  blockUser,
  unblockUser,
} = require("../controller/userController");
router.post("/signUp", signUp);
router.get("/getUsers", allUsers);
router.put("/update", UpdateData);
router.delete("/deleteUser/:userId", deleteUser);
//blocke-unblock user by admin
router.put("/blockUser/:id", [isAdmin], blockUser);
router.put("/unBlockUser/:id", [isAdmin], unblockUser);

module.exports = router;
