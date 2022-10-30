const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDetailSchema = new mongoose.Schema(
  {
    product: {},
    title: {
      type: String,
    },
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
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const ProductDetail = mongoose.model("ProductDetail", productDetailSchema);
module.exports = ProductDetail;
