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
        return res
          .status(400)
          .json({ message: "This type product already exists." });
      const newTypeProduct = new TypeProduct({ name });
      await newTypeProduct.save();
      res.json({
        type_product: newTypeProduct,
        message: "Created a type product",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteTypeProduct: async (req, res) => {
    try {
      const { id } = req.body;
      await TypeProduct.findByIdAndDelete(id);
      res.json({ message: " Deleted a type product" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateTypeProduct: async (req, res) => {
    try {
      const { name, id } = req.body;
      await TypeProduct.findOneAndUpdate({ _id: id }, { name });
      res.json({ message: " Update a type product" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = TypeProductCtrl;
