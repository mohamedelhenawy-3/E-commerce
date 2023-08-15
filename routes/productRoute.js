const router = require("express").Router();
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
const {
  createProduct,
  allProduct,
  addToWishlist,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
router.post("/createProduct/:categoryId/:brandId", [admin], createProduct);
router.get("/getAllProduct", [auth, admin], allProduct);
router.put("/wishlist", [auth], addToWishlist);
router.put("/:id", [admin], updateProduct);
router.delete("/:id", [admin], deleteProduct);
module.exports = router;
