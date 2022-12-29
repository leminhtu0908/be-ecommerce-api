const mongoose = require("mongoose");
const { orderStatus } = require("../constants/type");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    product_id: {
      type: String,
    },
    productNameOrder: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    total_product: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    price_pay: {
      type: Number,
      default: 0,
    },
    price_pay_remaining: {
      type: Number,
    },
    allow_status: {
      type: Number,
      default: 0,
    },
    visited: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cart: [],
    orderStatus: {
      type: String,
      default: orderStatus.cash,
    },
    isPayment: {
      type: Boolean,
      default: false,
    },
    apptransid: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
