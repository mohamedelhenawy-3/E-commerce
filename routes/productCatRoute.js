const router = require("express").Router();
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
} = require("../controller/productCatController");

router.post("/", [admin], createCategory);
router.put("/:id", [admin], updateCategory);
router.delete("/:id", [admin], deleteCategory);
router.get("/:id", [auth, admin], getCategory);
router.get("/", [auth, admin], getallCategory);

module.exports = router;
