const Color = require("../models/colorModel");

const ColorCtrl = {
  getAllColor: async (req, res) => {
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
      if (color) return res.status(400).send("This color already exists.");
      const newColor = new Color({ name });
      await newColor.save();
      res.json({ color: newColor, message: "Created successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteColor: async (req, res) => {
    try {
      const { id } = req.params;
      await Color.findByIdAndRemove(id);
      res.json({ message: " Deleted successfully!" });
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
      res.json({ color: color, message: " Update successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = ColorCtrl;