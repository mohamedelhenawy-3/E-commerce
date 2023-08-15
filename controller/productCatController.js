const Category = require("../models/productCategory");

const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
};
const updateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
};
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
};
const getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const getaCategory = await Category.findById(id);
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
};
const getallCategory = async (req, res) => {
  try {
    const getallCategory = await Category.find();
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
};
const UpdateProductImage = async (req, res, next) => {
  try {
    const product = await product.findById(req.params.id);

    const cloudinaryOptions = {
      folder: `/productImage/${product._id}`,
      quality: "auto:low", // Set the quality to low
      transformation: [
        { width: 300, height: 300, crop: "limit" }, // Resize the image to a smaller size
      ],
    };

    const cloudinaryResponse = Cloudinary.uploader.upload(
      req.file.path,
      cloudinaryOptions
    );

    const updateproduct = product;
    if (updateproduct.productImage) {
      updateproduct.productImage.public_id = cloudinaryResponse.public_id;
      updateproduct.productImage.url = cloudinaryResponse.url;
    } else {
      updateproduct.productImage = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      };
    }
    await updateproduct.save();
    res.status(200).json({
      message: "Profile image updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
  UpdateProductImage,
};
