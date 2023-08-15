const Product = require("../models/productModel");
const errResponse = require("../utils/errResponse");
const User = require("../models/userModel");
const productCategory = require("../models/productCategory");
const Brand = require("../models/brandModel");
const allProduct = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
};
const createProduct = async (req, res, next) => {
  try {
    const { title, description, color, price, quantity, slug } = req.body;

    const categoryId = req.params.categoryId;
    const category = await productCategory.findById(categoryId);
    const brandId = req.params.brandId;
    const brand = await Brand.findById(brandId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let createProduct = new Product({
      title: title,
      description: description,
      color: color,
      price: price,
      quantity: quantity,
      slug: slug,
      category: category, // Associate the product with the retrieved category
      brand: brand,
    });

    await createProduct.save();

    res.status(200).json({ createProduct: createProduct });
  } catch (err) {
    next(err);
  }
};
const addToWishlist = async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
};
const updateProduct = async (req, res) => {
  const id = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createProduct,
  allProduct,
  addToWishlist,
  deleteProduct,
  updateProduct,
};
