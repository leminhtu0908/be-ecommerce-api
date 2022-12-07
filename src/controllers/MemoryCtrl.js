const Memory = require("../models/memoryModel");

const MemoryCtrl = {
  getAllMemory: async (req, res) => {
    try {
      const memory = await Memory.find();
      res.send(memory);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createMemory: async (req, res) => {
    try {
      const { name } = req.body;
      const memory = await Memory.findOne({ name });
      if (memory) return res.status(400).send("Bộ nhớ đã tồn tại");
      const newMemory = await Memory({ name });
      await newMemory.save();
      res.json({ memory: newMemory, message: "Tạo bộ nhớ thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteMemory: async (req, res) => {
    try {
      const { id } = req.params;
      await Memory.findByIdAndRemove(id);
      res.json({ message: "Xóa bộ nhớ thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateMemory: async (req, res) => {
    try {
      const { name, id } = req.body;
      const memory = await Memory.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );
      res.json({ memory: memory, message: "Cập nhật bộ nhớ thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = MemoryCtrl;
