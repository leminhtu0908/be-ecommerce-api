const New = require("../models/newModel");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const NewCtrl = {
  getAllNew: async (req, res) => {
    try {
      const news = await New.find().sort({ createdAt: -1 });
      res.send(news);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createNew: async (req, res) => {
    try {
      //test postman paser JSON
      const { data } = req.body;
      const parserData = JSON.parse(data);
      const { title, content, typeNew, slug } = parserData;
      const file = req.file;
      if (title === "" || content === "" || typeNew === "" || slug === "") {
        res.status(500).json({ message: "Vui lòng nhập trường này" });
      }
      if (!file) {
        return res.status(500).send("Vui lòng tải ảnh lên");
      }
      if (file && !file.mimetype.match(/image-*/)) {
        return res.status(500).send("Ảnh không đúng định dạng");
      }
      let imageUrl;
      let imagePublicId;
      if (file) {
        const uploadImage = await uploadToCloudinary(file, "news");
        if (!uploadImage.secure_url) {
          return res.status(500).send({ message: "Tải ảnh thất bại" });
        }
        imageUrl = uploadImage.secure_url;
        imagePublicId = uploadImage.public_id;
      }
      const cloneNew = {
        title,
        content,
        typeNew,
        slug,
      };
      const newPost = new New({
        ...cloneNew,
        imageNew: imageUrl,
        imagePublicId: imagePublicId,
      });
      await newPost.save();
      res.send({ new: newPost, message: "Tạo bài viết thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteNew: async (req, res) => {
    try {
      const { id, imagePublicId } = req.body;
      if (imagePublicId) {
        const deleteImage = await deleteFromCloudinary(imagePublicId);
        if (deleteImage.result !== "ok") {
          return res.status(500).send({ message: "Xóa ảnh thất bại" });
        }
      }
      await New.findByIdAndDelete(id);
      res.json({ message: "Xóa bài viết thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateNew: async (req, res) => {
    //test postman paser JSON
    const { data } = req.body;
    const parserData = JSON.parse(data);
    const { id, imageToDeletePublicId, title, content, typeNew, slug } =
      parserData;
    const file = req.file;
    if (imageToDeletePublicId) {
      const deleteImage = await deleteFromCloudinary(imageToDeletePublicId);
      if (deleteImage.result !== "ok") {
        return res.status(500).send({ message: "Xóa ảnh thất bại" });
      }
    }
    let imageUrl;
    let imagePublicId;
    if (file) {
      const uploadImage = await uploadToCloudinary(file, "news");
      if (!uploadImage.secure_url) {
        return res.status(500).send({ message: "Tải ảnh không thành công" });
      }
      imageUrl = uploadImage.secure_url;
      imagePublicId = uploadImage.public_id;
    }
    const cloneNew = {
      title,
      content,
      typeNew,
      slug,
    };
    const news = await New.findOneAndUpdate(
      { _id: id },
      { ...cloneNew, imageNew: imageUrl, imagePublicId: imagePublicId },
      { new: true }
    );
    res.json({ news: news, message: "Cập nhật bài viết thành công" });
  },
};

module.exports = NewCtrl;
