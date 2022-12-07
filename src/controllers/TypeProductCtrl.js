const TypeProduct = require("../models/typeProductModel");

const TypeProductCtrl = {
  getAllTypeProduct: async (req, res) => {
    try {
      const typeProduct = await TypeProduct.find();
      res.json(typeProduct);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createTypeProduct: async (req, res) => {
    try {
      const { name } = req.body;
      const typeProduct = await TypeProduct.findOne({ name });
      if (typeProduct)
        return res.status(400).json({ message: "Loại sản phẩm đã tồn tại" });
      const newTypeProduct = new TypeProduct({ name });
      await newTypeProduct.save();
      res.json({
        type_product: newTypeProduct,
        message: "Tạo loại sản phẩm thành công",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteTypeProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const typeproduct = await TypeProduct.findById(id);
      if (typeproduct?.products.length > 0) {
        return res
          .status(400)
          .send("Vui lòng xóa tất cả sản phẩm có chứa loại sản phẩm");
      } else {
        await TypeProduct.findByIdAndDelete(id);
        res.json({ message: "Xóa loại sản phẩm thành công" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateTypeProduct: async (req, res) => {
    try {
      const { name, id } = req.body;
      const typeProduct = await TypeProduct.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );
      res.json({
        typeProduct: typeProduct,
        message: "Cập nhật loại sản phẩm thành công",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = TypeProductCtrl;
