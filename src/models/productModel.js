const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    display: { type: String, required: true },
    rate: { type: Number, default: 0 },
    totalRate: { type: Number, default: 0 },
    totalReview: { type: Number, default: 0 },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    imageMulti: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    memory: {
      type: String,
    },
    colors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Color",
      },
    ],
    typeProduct: {
      type: Schema.Types.ObjectId,
      ref: "TypeProduct",
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    sold: { type: Number, default: 0 },
    title: {
      type: String,
    },
    content: { type: String },
    heDieuHanh: {
      type: String,
    },
    camera_truoc: {
      type: String,
    },
    discount: { type: Number },
    price_discount: { type: Number },
    camera_sau: {
      type: String,
    },
    chip: {
      type: String,
    },
    ram: {
      type: String,
    },
    dungluongluutru: {
      type: String,
    },
    sim: {
      type: String,
    },
    pin_sac: {
      type: String,
    },
    thietke: {
      type: String,
    },
    chatlieu: {
      type: String,
    },
    kichthuoc_khoiluong: {
      type: String,
    },
    thoidiemramat: {
      type: String,
    },
    soluong_sanpham: {
      type: Number,
      default: 0,
    },
    discount: {
      type: String,
    },
    stocking: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    comments: [],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
