const Brand = require("../models/brandModel");
const Cloudinary = require("../utils/cloudinary");
const Product = require("../models/productModel");

const createBrand = async (req, res, next) => {
  try {
    const { title } = req.body;
    const newBrand = new Brand({
      title: title,
    });
    await newBrand.save();
    res.status(200).json({ newBrand });
  } catch (error) {
    next(error);
  }
};

const uploadBrandImage = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    const imgs = [];

    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse("No files uploaded"));
    }

    for (let i = 0; i < req.files.length; i++) {
      try {
        const cloudinary = await Cloudinary.uploader.upload(req.files[i].path, {
          folder: `Brand/BrandImages/${brand.brandImage}`,
          resource_type: "image",
        });
        imgs.push({
          public_id: cloudinary.public_id,
          url: cloudinary.url,
        });
      } catch (error) {
        // Handle the error that occurred during image upload
        return next(error);
      }
    }

    const updateBrand = brand;
    updateBrand.brandImage.push(...imgs);
    await updateBrand.save();
    res.status(200).json({ message: "brand image update successfully" });
  } catch (error) {
    next(error);
  }
};
const updateBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ message: "Upadet brand data succefully" });
  } catch (error) {
    throw new Error(error);
  }
};
const deleteBrand = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (product.brand.include(id)) {
    product.brand = product.brand.filter((xx) => {
      xx.toString() !== id.toString();
    });
    await product.save();
  }
  const delBrand = await Brand.findById(id);
  if (delBrand.length != 0) {
    Cloudinary.api.delete_resources_by_prefix(
      `Brand/BrandImages/${delBrand.brandImage}`,
      function (err) {
        if (err && err.http_code !== 404) {
          return callback(err);
        }
        Cloudinary.api.delete_folder(
          `Brand/BrandImages/${delBrand.brandImage}`,
          function (err, result) {
            console.log(err);
          }
        );
      }
    );
  }
  res.status(200).json({ Message: "delete lecture successfully" });
};

const getBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const getaBrand = await Brand.findById(id);
    res.json(getaBrand);
  } catch (error) {
    throw new Error(error);
  }
};
const getallBrand = async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.json(getallBrand);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBrand,
  uploadBrandImage,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
};
