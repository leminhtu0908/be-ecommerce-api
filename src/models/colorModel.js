const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colorSchema = new mongoose.Schema(
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
const Color = mongoose.model("Color", colorSchema);
module.exports = Color;
