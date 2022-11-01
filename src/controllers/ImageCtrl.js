const Image = require("../models/imageModel");
const { uploadToCloudinary } = require("../utils/cloudinary");

const ImageCtrl = {
  getAllImage: async (req, res) => {
    try {
      const image = await Image.find();
      res.send(image);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getImageByIdProduct: async (req, res) => {},
  upLoadImage: async (req, res) => {
    try {
      const { imagePublicId, coverImagePublicId, isCover } = req.body;
      const imagefind = req.file;
      if (!imagefind) {
        return res.status(500).send("Please upload an image.");
      }
      if (imagefind && !imagefind.mimetype.match(/image-*/)) {
        return res.status(500).send("Please upload an image.");
      }
      const coverOrImagePublicId =
        isCover === "true" ? coverImagePublicId : imagePublicId;
      const uploadImage = await uploadToCloudinary(
        imagefind,
        "images",
        coverOrImagePublicId
      );
      if (uploadImage.secure_url) {
        const addimage = {};
        if (isCover === "true") {
          addimage.coverImage = uploadImage.secure_url;
          addimage.coverImagePublicId = uploadImage.public_id;
        } else {
          addimage.image = uploadImage.secure_url;
          addimage.imagePublicId = uploadImage.public_id;
        }
        const newimage = new Image(addimage);
        await newimage.save();
        res.send({ image: newimage });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  upLoadMultiImage: async (req, res) => {
    try {
      const { imageMultiple } = req.body;
      const files = req.files;
      if (!files) {
        return res.status(500).send("Please upload an image.");
      }
      if (files && !files.map((item) => item.mimetype.match(/image-*/))) {
        return res.status(500).send("Please upload an image.");
      }
      const url = [];
      for (const file of files) {
        const uploadImage = uploadToCloudinary(file, "images", imageMultiple);
        url.push(uploadImage);
      }
      const urls = await Promise.all(url);
      const p = urls.map((item) => item.secure_url);
      const newimage = new Image({ imageMultiple: p });
      await newimage.save();
      res.send({
        newimage,
        message: "Upload image successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = ImageCtrl;
