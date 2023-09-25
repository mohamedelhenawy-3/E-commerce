const router = require("express").Router();
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
const {
  createProduct,
  allProduct,
  addToWishlist,
  updateProduct,
  deleteProduct,
  oneProduct,
} = require("../controller/productController");
router.post(
  "/createProduct/:categoryId/:brandId",
  [auth, admin],
  createProduct
);
router.get("/getAllProduct", [auth, admin], allProduct); //[auth, admin]
router.put("/wishlist", [auth], addToWishlist); //[auth],
router.put("/:id", [auth, admin], updateProduct); //[auth, admin],
router.delete("/:id", [auth, admin], deleteProduct); // [auth, admin],
//get one product
router.get("/getProduct/:productId", oneProduct);

module.exports = router;
