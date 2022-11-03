const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    display: { type: String, required: true },
    rate: { type: Number },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    memorys: [
      {
        type: Schema.Types.ObjectId,
        ref: "Memory",
      },
    ],
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

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
