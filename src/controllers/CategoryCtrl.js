const Category = require("../models/categoryModel");
const CategoryCtrl = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getCategory: async (req, res) => {
    try {
      const { name } = req.query;
      const categories = await Category.findOne({
        $text: {
          $search: name,
        },
      });
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category) {
        return res.status(500).send("Danh mục đã tồn tại");
      }
      const newCategory = new Category({ name });
      await newCategory.save();
      res.json({ category: newCategory, message: "Tạo danh mục thành công!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const categories = await Category.findById(id);
      if (categories?.products.length > 0) {
        return res
          .status(400)
          .send("Vui lòng xóa tất cả các sản phẩm chứa trong danh mục");
      } else {
        await Category.findByIdAndDelete(id);
        res.json({ message: " Xóa danh mục thành công" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name, id } = req.body;
      const categoryUpdate = await Category.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );
      res.json({
        category: categoryUpdate,
        message: "Cập nhật danh mục thành công",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  searchCategory: async (req, res) => {
    const { name } = req.query;
    const perPage = req.params.perPage || 10;
    const page = req.params.page || 1;
    if (name === "") {
      // let query = Category.find({ name }).sort({ _id: -1 });
      // let data = await query.limit(perPage).skip((page - 1) * perPage);
      // const totalDocuments = await query.countDocuments();
      // const totalPage = Math.ceil(totalDocuments / perPage);
      // res.send(data, {
      //   page,
      //   perPage,
      //   totalPage,
      //   totalDocuments,
      // });
      const data = await Category.find().sort({ createdAt: -1 });
      res.send(data);
    } else {
      const data = await Category.find({
        name: { $regex: name, $options: "$i" },
      });
      res.send(data);
    }
  },
};

module.exports = { CategoryCtrl };
