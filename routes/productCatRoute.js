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

router.post("/", [auth, admin], createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", [auth, admin], deleteCategory);
router.get("/:id", getCategory);
router.get("/", getallCategory);
router.put(
  "/productImage/:id",
  [auth, admin],
  Upload.single("file"),
  UpdateProductImage
);

module.exports = router;
