const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    products: [],
  },
  {
    timestamps: true,
  }
);
const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
