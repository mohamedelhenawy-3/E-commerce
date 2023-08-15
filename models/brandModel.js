const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const brandSchema = new Schema({
  title: {
    type: String,
    required: true, // Set to true to make the title required
    minlength: 1,
    maxlength: 255,
  },
  brandImage: [
    {
      public_id: {
        type: String,
        default: null, // Set default value to null or remove the default option
      },
      url: {
        type: String,
        default: null, // Set default value to null or remove the default option
      },
    },
  ],
});

module.exports = mongoose.model("Brand", brandSchema);
