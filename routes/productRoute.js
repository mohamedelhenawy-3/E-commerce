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
router.post(
  "/createProduct/:categoryId/:brandId",
  [auth, admin],
  createProduct
);
router.get("/getAllProduct", [auth, admin], allProduct);
router.put("/wishlist", [auth], addToWishlist);
router.put("/:id", [auth, admin], updateProduct);
router.delete("/:id", [auth, admin], deleteProduct);
module.exports = router;
