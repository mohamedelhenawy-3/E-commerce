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

router.post("/", createBrand);
router.put("/uploadBrandimage/:id", Upload.array("files"), uploadBrandImage);

router.put("/:id", updateBrand);
router.delete("/:brandId/:productId", deleteBrand);
router.get("/:id", getBrand);
router.get("/", getallBrand);

module.exports = router;
