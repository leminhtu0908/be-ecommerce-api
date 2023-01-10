const Color = require("../models/colorModel");

const ColorCtrl = {
  getAllColor: async (req, res) => {
    try {
      let perPage = req.query.per_page || 10; // số lượng sản phẩm xuất hiện trên 1 page
      let page = req.query.current_page || 0;
      Color.find() // find tất cả các data
        .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, color) => {
          Color.countDocuments((err, count) => {
            if (err) return next(err);
            res.send({
              content: color,
              size: perPage,
              totalElements: count,
              totalPages: Math.ceil(count / perPage),
            }); // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
          });
        });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getColors: async (req, res) => {
    try {
      const color = await Color.find();
      res.send(color);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createColor: async (req, res) => {
    try {
      const { name } = req.body;
      const color = await Color.findOne({ name });
      if (color) {
        return res.status(500).send("Màu đã tồn tại");
      }
      const newColor = new Color({ name });
      await newColor.save();
      res.json({ color: newColor, message: "Tạo màu thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteColor: async (req, res) => {
    try {
      const { id } = req.params;
      await Color.findByIdAndRemove(id);
      res.json({ message: "Xóa màu thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateColor: async (req, res) => {
    try {
      const { name, id } = req.body;
      const color = await Color.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );
      res.json({ color: color, message: "Cập nhật màu thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = ColorCtrl;
