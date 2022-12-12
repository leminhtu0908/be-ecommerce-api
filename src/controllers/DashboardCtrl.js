const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const DashboardController = {
  getDashboard: async (req, res) => {
    try {
      let totalApple = 0;
      let totalSamsung = 0;
      let totalXiaomi = 0;
      let totalOppo = 0;
      let totalVivo = 0;
      let totalRealme = 0;
      let totalNokia = 0;
      const productSold = await Product.find();
      const findTypeProduct = await Product.find().populate([
        { path: "category", select: "-products" },
        {
          path: "brand",
          select: "-products",
        },
        {
          path: "imageMulti",
        },
        {
          path: "colors",
          select: "-products",
        },
        {
          path: "typeProduct",
          select: "-products",
        },
      ]);
      /* Apple */
      const apple = findTypeProduct.filter(
        (item) => item.brand.name === "Apple"
      );
      apple.forEach((item) => (totalApple += item.sold));
      /*Samsung*/
      const samsung = findTypeProduct.filter(
        (item) => item.brand.name === "Samsung"
      );
      samsung.forEach((item) => (totalSamsung += item.sold));
      /* Oppo */
      const oppo = findTypeProduct.filter((item) => item.brand.name === "Oppo");
      oppo.forEach((item) => (totalOppo += item.sold));
      /* Xiaomi */
      const xiaomi = findTypeProduct.filter(
        (item) => item.brand.name === "Xiaomi"
      );
      xiaomi.forEach((item) => (totalXiaomi += item.sold));
      /* Vivo */
      const vivo = findTypeProduct.filter((item) => item.brand.name === "Vivo");
      vivo.forEach((item) => (totalVivo += item.sold));
      /* Realme */
      const realme = findTypeProduct.filter(
        (item) => item.brand.name === "Realme"
      );
      realme.forEach((item) => (totalRealme += item.sold));
      /* Nokia */
      const nokia = findTypeProduct.filter(
        (item) => item.brand.name === "Nokia"
      );
      nokia.forEach((item) => (totalNokia += item.sold));
      const orderDistroyed = await Order.find({ allow_status: 2 }).count();
      const orderUnAllow = await Order.find({ allow_status: 0 }).count();
      let totalSold = 0;
      const dataChart = [
        { name: "Apple", sold: totalApple },
        { name: "Samsung", sold: totalSamsung },
        { name: "Oppo", sold: totalOppo },
        { name: "Xiaomi", sold: totalXiaomi },
        { name: "Vivo", sold: totalVivo },
        { name: "Realme", sold: totalRealme },
        { name: "Nokia", sold: totalNokia },
      ];
      const dataTable = [
        {
          soluong_sanpham: "Số lượng sản phẩm",
          apple_count: totalApple,
          samsung_count: totalSamsung,
          oppo_count: totalOppo,
          xiaomi_count: totalXiaomi,
          vivo_count: totalVivo,
          realme_count: totalRealme,
          nokia_count: totalNokia,
        },
      ];
      productSold.forEach((item) => (totalSold += item.sold));
      res.json({
        totalSold: totalSold,
        orderDistroyed: orderDistroyed,
        orderUnAllow: orderUnAllow,
        data: dataChart,
        dataTable: dataTable,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = DashboardController;
