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
      if (memory)
        return res.status(400).json({ message: "This memory already exists." });
      const newMemory = await Memory({ name });
      await newMemory.save();
      res.json({ memory: newMemory, message: "Created a memory" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteMemory: async (req, res) => {
    try {
      const { id } = req.body;
      await Memory.findByIdAndRemove(id);
      res.json({ message: " Deleted a memory" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateMemory: async (req, res) => {
    try {
      const { name, id } = req.body;
      await Memory.findOneAndUpdate({ _id: id }, { name });
      res.json({ message: " Update a memory" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = MemoryCtrl;
