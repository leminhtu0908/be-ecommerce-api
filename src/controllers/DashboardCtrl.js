const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const DashboardController = {
  getDashboard: async (req, res) => {
    try {
      const productSold = await Product.find();
      const orderDistroyed = await Order.find({ allow_status: 2 }).count();
      const orderUnAllow = await Order.find({ allow_status: 0 }).count();
      let totalSold = 0;
      productSold.forEach((item) => (totalSold += item.sold));
      res.json({
        totalSold: totalSold,
        orderDistroyed: orderDistroyed,
        orderUnAllow: orderUnAllow,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = DashboardController;
