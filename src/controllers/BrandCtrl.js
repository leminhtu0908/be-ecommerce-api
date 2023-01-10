const Brand = require("../models/brandModel");

const BrandCtrl = {
  getAllBrand: async (req, res) => {
    try {
      const brands = await Brand.find();
      res.json(brands);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createBrand: async (req, res) => {
    try {
      const { name } = req.body;
      const brand = await Brand.findOne({ name });
      if (brand) {
        return res.status(500).send("Nhà sản xuất đã tồn tại");
      }
      const newBrand = new Brand({ name });
      await newBrand.save();
      res.json({ brand: newBrand, message: "Tạo nhà sản xuất thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteBrand: async (req, res) => {
    try {
      const { id } = req.params;
      const brands = await Brand.findById(id);
      if (brands?.products.length > 0) {
        return res
          .status(400)
          .send("Vui lòng xóa tất cả các sản phẩm chứa trong nhà sản xuất");
      } else {
        await Brand.findByIdAndRemove(id);
        res.json({ message: "Xóa nhà sản xuất thành công!" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateBrand: async (req, res) => {
    try {
      const { name, id } = req.body;
      const brand = await Brand.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );
      res.json({ brand: brand, message: "Cập nhật nhà xuất thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = BrandCtrl;
