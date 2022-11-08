const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    products: [],
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
categorySchema.index({ name: "text" });
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
