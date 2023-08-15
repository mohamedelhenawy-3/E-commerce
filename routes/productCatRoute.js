const router = require("express").Router();
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
const Upload = require("../utils/multer");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
  UpdateProductImage,
} = require("../controller/productCatController");

router.post("/", [admin], createCategory);
router.put("/:id", [admin], updateCategory);
router.delete("/:id", [admin], deleteCategory);
router.get("/:id", [auth, admin], getCategory);
router.get("/", [auth, admin], getallCategory);
router.put("/productImage/:id", Upload.single("file"), UpdateProductImage);

module.exports = router;
