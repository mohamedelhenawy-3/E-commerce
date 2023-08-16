const router = require("express").Router();
const admin = require("../middlware/isAdmin");
const auth = require("../middlware/authMiddlware");
const Upload = require("../utils/multer");

const {
  createBrand,
  uploadBrandImage,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../controller/brandController");

router.post("/", [auth, admin], createBrand);
router.put(
  "/uploadBrandimage/:id",
  [auth, admin],
  Upload.array("files"),
  uploadBrandImage
);

router.put("/:id", [auth, admin], updateBrand);
router.delete("/:brandId/:productId", [auth, admin], deleteBrand);
router.get("/:id", getBrand);
router.get("/", getallBrand);

module.exports = router;
