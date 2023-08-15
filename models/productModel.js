const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
  },
  description: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  sold: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 255,
  },
  price: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  slug: {
    type: String,
    require: true,
    //select: false,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "PCategory",
  },
  productImage: {
    public_id: {
      type: String,
      default: null, // Set default value to null or remove the default option
    },
    url: {
      type: String,
      default: null, // Set default value to null or remove the default option
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
