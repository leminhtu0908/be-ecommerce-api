const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const TypeProduct = require("../models/typeProductModel");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const ProductDetail = require("../models/productDetailModel");

//Filter, sorting and pagination
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; // queryString = req.query
    const excludedFileds = ["page", "sort", "limit"];
    excludedFileds.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const ProductCtrl = {
  getAllProduct: async (req, res) => {
    try {
      const features = new APIfeatures(
        Product.find().populate([
          {
            path: "memorys",
            select: "-products",
          },
          { path: "category", select: "-products" },
          {
            path: "brand",
            select: "-products",
          },
          {
            path: "colors",
            select: "-products",
          },
          {
            path: "typeProduct",
            select: "-products",
          },
          {
            path: "description",
            select: "-product",
          },
        ]),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;
      res.json({
        status: "success",
        results: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      //test postman paser JSON
      const { data } = req.body;
      const parserData = JSON.parse(data);
      const {
        product_id,
        name,
        price,
        memorys,
        display,
        colors,
        category_id,
        brand_id,
        typeProduct_id,
      } = parserData;
      const file = req.file;
      let imageUrl;
      let imagePublicId;
      if (file) {
        const uploadImage = await uploadToCloudinary(file, "products");
        if (!uploadImage.secure_url) {
          return res.status(500).send({ message: "Upload file failed" });
        }
        imageUrl = uploadImage.secure_url;
        imagePublicId = uploadImage.public_id;
      }

      const product = await Product.findOne({ product_id });
      if (product)
        return res
          .status(400)
          .json({ message: "This product already exists." });
      const newProductAndCategory = {
        name,
        product_id,
        price,
        display,
        memorys,
        colors,
        image: imageUrl,
        imagePublicId: imagePublicId,
        brand: brand_id,
        category: category_id,
        typeProduct: typeProduct_id,
      };
      const addProduct = await new Product(newProductAndCategory).save();
      await addProduct.populate([
        { path: "category", select: "-products" },
        {
          path: "memorys",
          select: "-products",
        },
        {
          path: "colors",
          select: "-products",
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
      await Brand.findOneAndUpdate(
        { _id: brand_id },
        { $push: { products: addProduct } }
      );
      await Category.findOneAndUpdate(
        { _id: category_id },
        { $push: { products: addProduct } }
      );
      await TypeProduct.findOneAndUpdate(
        { _id: typeProduct_id },
        { $push: { products: addProduct } }
      );
      res.json({
        product: addProduct,
        message: "Created a product successfully",
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id, imagePublicId } = req.body;
      if (imagePublicId) {
        const deleteImage = await deleteFromCloudinary(imagePublicId);
        if (deleteImage.result !== "ok") {
          return res.status(500).send({ message: "Error deleting image" });
        }
      }
      const product = await Product.findById(id);
      const categories = await Category.findById(product.category);

      categories.products = categories.products.filter(
        (item) => item.product_id !== product.product_id
      );
      await categories.save();
      const brands = await Brand.findById(product.brand);
      brands.products = brands.products.filter(
        (item) => item.product_id !== product.product_id
      );
      await brands.save();
      const typeProduct = await TypeProduct.findById(product.typeProduct);
      typeProduct.products = typeProduct.products.filter(
        (item) => item.product_id !== product.product_id
      );
      await typeProduct.save();
      await ProductDetail.findOneAndRemove(product?.description?._id);
      await Product.findByIdAndDelete(id);
      res.json({ message: " Deleted new successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { data } = req.body;
      const parserData = JSON.parse(data);
      const {
        id,
        imageToDeletePublicId,
        name,
        price,
        memorys,
        display,
        colors,
        category_id,
        brand_id,
        typeProduct_id,
      } = parserData;
      const file = req.file;
      if (imageToDeletePublicId) {
        const deleteImage = await deleteFromCloudinary(imageToDeletePublicId);
        if (deleteImage.result !== "ok") {
          return res.status(500).send({ message: "Error deleting image" });
        }
      }
      let imageUrl;
      let imagePublicId;
      if (imageUrl && imagePublicId) {
        image = imageUrl;
        imagePublicId = imagePublicId;
      } else if (imageToDeletePublicId) {
        imageUrl = "";
        imagePublicId = "";
      }
      if (file) {
        const uploadImage = await uploadToCloudinary(file, "products");
        if (!uploadImage.secure_url) {
          return res.status(500).send({ message: "Upload file failed" });
        }
        imageUrl = uploadImage.secure_url;
        imagePublicId = uploadImage.public_id;
      }
      const cloneProduct = {
        name,
        price,
        memorys,
        display,
        colors,
        category_id,
        brand_id,
        typeProduct_id,
      };
      await Product.findOneAndUpdate(
        { _id: id },
        { ...cloneProduct, image: imageUrl, imagePublicId: imagePublicId },
        { new: true }
      );
      res.json({ message: " Update Product Successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ProductCtrl;
