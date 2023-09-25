const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    unique: true,
    uppercase: true,
  },
  expiry: {
    type: Date,
    required: false,
  },
  discount: {
    type: Number,
    required: false,
  },
});

//Export the model
module.exports = mongoose.model("Coupon", couponSchema);
