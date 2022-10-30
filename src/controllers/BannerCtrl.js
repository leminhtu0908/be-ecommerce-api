const Banner = require("../models/bannerModel");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");

const BannerCtrl = {
  getAllBanner: async (req, res) => {
    try {
      const banner = await Banner.find();
      res.send(banner);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  uploadBanner: async (req, res) => {
    try {
      const { imagePublicId, coverImagePublicId, isCover } = req.body;
      const file = req.file;
      if (!file) {
        return res.status(500).send("Please upload an image.");
      }
      if (file && !file.mimetype.match(/image-*/)) {
        return res.status(500).send("Please upload an image.");
      }
      const coverOrImagePublicId =
        isCover === "true" ? coverImagePublicId : imagePublicId;
      const uploadImage = await uploadToCloudinary(
        file,
        "banners",
        coverOrImagePublicId
      );
      if (uploadImage.secure_url) {
        const addimage = {};
        if (isCover === "true") {
          addimage.coverImage = uploadImage.secure_url;
          addimage.coverImagePublicId = uploadImage.public_id;
        } else {
          addimage.imageBanner = uploadImage.secure_url;
          addimage.imagePublicId = uploadImage.public_id;
        }
        console.log(addimage);
        const newBanner = new Banner(addimage);
        await newBanner.save();
        res.send({
          banner: newBanner,
          message: "Upload image banner successfully",
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteBanner: async (req, res) => {
    try {
      const { id, imagePublicId } = req.body;
      if (imagePublicId) {
        const deleteImage = await deleteFromCloudinary(imagePublicId);
        if (deleteImage.result !== "ok") {
          return res.status(ErrorCodes.Internal).send(ErrorMessages.Generic);
        }
      }
      await Banner.findByIdAndDelete(id);
      res.json({ message: " Deleted image banner successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = BannerCtrl;
