const ErrorCodes = require("../constants/errorCodes");
const ErrorMessages = require("../constants/errorMessages");
const Image = require("../models/imageModel");
const Product = require("../models/productModel");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

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
      const { data } = req.body;
      const parserData = JSON.parse(data);
      const { name } = parserData;
      // const { imagePublicId, coverImagePublicId, isCover } = req.body;
      // const imagefind = req.file;
      // if (!imagefind) {
      //   return res.status(500).send("Please upload an image.");
      // }
      // if (imagefind && !imagefind.mimetype.match(/image-*/)) {
      //   return res.status(500).send("Please upload an image.");
      // }
      // const coverOrImagePublicId =
      //   isCover === "true" ? coverImagePublicId : imagePublicId;
      // const uploadImage = await uploadToCloudinary(
      //   imagefind,
      //   "images",
      //   coverOrImagePublicId
      // );
      // if (uploadImage.secure_url) {
      //   const addimage = {};
      //   if (isCover === "true") {
      //     addimage.coverImage = uploadImage.secure_url;
      //     addimage.coverImagePublicId = uploadImage.public_id;
      //   } else {
      //     addimage.image = uploadImage.secure_url;
      //     addimage.imagePublicId = uploadImage.public_id;
      //   }
      //   const newimage = new Image(addimage);
      //   await newimage.save();
      //   res.send({ image: newimage });
      // }const { data } = req.body;
      const file = req.file;
      if (name === "") {
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
        const uploadImage = await uploadToCloudinary(file, "images");
        if (!uploadImage.secure_url) {
          return res.status(500).send({ message: "Tải ảnh thất bại" });
        }
        imageUrl = uploadImage.secure_url;
        imagePublicId = uploadImage.public_id;
      }
      const newimage = new Image({
        name,
        image: imageUrl,
        imagePublicId: imagePublicId,
      });
      await newimage.save();
      res.send({ image: newimage });
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
        message: "Tải ảnh thành công",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteImage: async (req, res) => {
    try {
      const { id, imagePublicId } = req.body;
      const products = await Product.find().populate([
        { path: "category", select: "-products" },
        {
          path: "colors",
          select: "-products",
        },
        {
          path: "imageMulti",
        },
        {
          path: "brand",
          select: "-products",
        },
        {
          path: "typeProduct",
          select: "-products",
        },
      ]);
      let arrayTemp = [];
      products?.map((item) => {
        if (item.imageMulti?.length > 0) {
          item?.imageMulti?.filter((itemImage) => {
            arrayTemp.push(itemImage);
          });
        }
      });
      const findItem = arrayTemp?.filter(
        (item) => item.imagePublicId === imagePublicId
      );
      if (findItem?.length > 0) {
        return res
          .status(500)
          .send("Không thể xóa, Ảnh được chứa trong sản phẩm");
      }
      if (imagePublicId) {
        const deleteImage = await deleteFromCloudinary(imagePublicId);
        if (deleteImage.result !== "ok") {
          return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
        }
      }
      await Image.findByIdAndDelete(id);
      res.json({ message: "Xóa ảnh sản phẩm thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = ImageCtrl;
