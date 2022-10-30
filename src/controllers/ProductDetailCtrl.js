const ProductDetail = require("../models/productDetailModel");
const Product = require("../models/productModel");

const ProductDetailCtrl = {
  getAllProductDetail: async (req, res) => {
    try {
      const detail = await ProductDetail.find();
      res.json(detail);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createProductDetail: async (req, res) => {
    try {
      const {
        id,
        title,
        heDieuHanh,
        camera_truoc,
        camera_sau,
        chip,
        ram,
        dungluongluutru,
        sim,
        pin_sac,
        thietke,
        chatlieu,
        kichthuoc_khoiluong,
        thoidiemramat,
      } = req.body;
      const product = await Product.findById(id);
      const newDetail = {
        title,
        heDieuHanh,
        camera_truoc,
        camera_sau,
        chip,
        ram,
        dungluongluutru,
        sim,
        pin_sac,
        thietke,
        chatlieu,
        kichthuoc_khoiluong,
        thoidiemramat,
        product: product,
      };
      const newProductDetailDB = await new ProductDetail(newDetail).save();
      await Product.findOneAndUpdate(
        { _id: product._id },
        {
          description: newProductDetailDB,
        }
      );
      await newProductDetailDB.populate("product");
      res.json({
        detail: newProductDetailDB,
        message: "Created a detail product",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateProductDetail: async (req, res) => {
    try {
      const {
        id,
        title,
        heDieuHanh,
        camera_truoc,
        camera_sau,
        chip,
        ram,
        dungluongluutru,
        sim,
        pin_sac,
        thietke,
        chatlieu,
        kichthuoc_khoiluong,
        thoidiemramat,
      } = req.body;
      const cloneUpdate = {
        title,
        heDieuHanh,
        camera_truoc,
        camera_sau,
        chip,
        ram,
        dungluongluutru,
        sim,
        pin_sac,
        thietke,
        chatlieu,
        kichthuoc_khoiluong,
        thoidiemramat,
      };
      await ProductDetail.findOneAndUpdate({ _id: id }, cloneUpdate);
      res.json({ message: " Update product detail uccessfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = ProductDetailCtrl;
