const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const TypeProduct = require("../models/typeProductModel");
const Order = require("../models/orderModel");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinary");
const ProductDetail = require("../models/productDetailModel");

//Filter, sorting and pagination
class APIfeatures {
  constructor(query, queryString) {
    this.query = query || "";
    this.queryString = queryString || "";
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
    // try {
    //   const features = new APIfeatures(
    //     Product.find().populate([
    //       {
    //         path: "memorys",
    //         select: "-products",
    //       },
    //       { path: "category", select: "name" },
    //       {
    //         path: "brand",
    //         select: "name",
    //       },
    //       {
    //         path: "colors",
    //         select: "-products",
    //       },
    //       {
    //         path: "typeProduct",
    //         select: "-products",
    //       },
    //     ]),
    //     req.query
    //   )
    //     .filtering()
    //     .sorting()
    //     .paginating();
    //   const products = await features.query;
    //   res.json({
    //     status: "success",
    //     results: products.length,
    //     products: products,
    //   });
    // } catch (error) {
    //   return res.status(500).json({ message: error.message });
    // }
    try {
      const {
        name,
        display,
        ram,
        pin_sac,
        price,
        brand,
        memory,
        typeProduct,
        price_in,
        price_to,
      } = req.query;
      const query =
        name === "" &&
        display === "" &&
        ram === "" &&
        pin_sac === "" &&
        price === "" &&
        brand === "" &&
        memory === "" &&
        typeProduct === "" &&
        price_in === "" &&
        price_to === "";
      if (query) {
        const products = await Product.find()
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
            },
            {
              path: "colors",
              select: "-products",
            },
            {
              path: "typeProduct",
              select: "-products",
            },
          ])
          .sort({ createdAt: -1 });
        res.send({ products: products });
      } else if (brand !== "") {
        const products = await Product.find({})
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
            },
            {
              path: "colors",
              select: "-products",
            },
            {
              path: "typeProduct",
              select: "-products",
            },
          ])
          .sort(price === "Gi?? t??? cao ?????n th???p" ? { price: -1 } : { price: 1 });
        const arrProduct = products?.filter(
          (item) => item.brand.name === brand
        );
        res.send({ products: arrProduct });
      } else if (typeProduct !== "") {
        const products = await Product.find()
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
            },
            {
              path: "colors",
              select: "-products",
            },
            {
              path: "typeProduct",
              select: "-products",
            },
          ])
          .sort(price === "Gi?? t??? cao ?????n th???p" ? { price: -1 } : { price: 1 });
        const arrProduct = products?.filter(
          (item) => item.typeProduct.name === typeProduct
        );
        res.send({ products: arrProduct });
      }
      // else if (price !== "") {
      //   const products = await Product.find({})
      //     .populate([
      //       { path: "category", select: "-products" },
      //       {
      //         path: "brand",
      //         select: "-products",
      //       },
      //       {
      //         path: "colors",
      //         select: "-products",
      //       },
      //       {
      //         path: "imageMulti",
      //       },
      //       {
      //         path: "typeProduct",
      //         select: "-products",
      //       },
      //     ])
      //     .sort(price === "Gi?? t??? cao ?????n th???p" ? { price: -1 } : { price: 1 });
      //   res.send({ products: products });
      // }
      else {
        const products = await Product.find({
          name: { $regex: name, $options: "$i" },
          display: { $regex: display, $options: "$i" },
          ram: { $regex: ram, $options: "$i" },
          pin_sac: { $regex: pin_sac, $options: "$i" },
          memory: { $regex: memory, $options: "$i" },
          price: { $gte: Number(price_in), $lte: Number(price_to) },
        })
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
            },
            {
              path: "colors",
              select: "-products",
            },
            {
              path: "typeProduct",
              select: "-products",
            },
          ])
          .sort(price === "Gi?? t??? cao ?????n th???p" ? { price: -1 } : { price: 1 });
        res.send({ products: products });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllProductByName: async (req, res) => {
    try {
      const { name } = req.query;
      if (name === "") {
        const products = await Product.find()
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
            },
            {
              path: "colors",
              select: "-products",
            },
            {
              path: "typeProduct",
              select: "-products",
            },
          ])
          .sort({ createdAt: -1 });
        res.send({ products: products });
      } else {
        const products = await Product.find({
          name: { $regex: name, $options: "$i" },
        })
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
            },
            {
              path: "colors",
              select: "-products",
            },
            {
              path: "typeProduct",
              select: "-products",
            },
          ])
          .sort({ createdAt: -1 });
        res.send({ products: products });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getProductsPanigate: async (req, res) => {
    try {
      const { name } = req.query;
      let perPage = req.query.per_page || 10; // s??? l?????ng s???n ph???m xu???t hi???n tr??n 1 page
      let page = req.query.current_page || 0;
      if (name === "") {
        Product.find()
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
            },
            {
              path: "colors",
              select: "-products",
            },
            {
              path: "typeProduct",
              select: "-products",
            },
          ])
          .skip(perPage * page - perPage) // Trong page ?????u ti??n s??? b??? qua gi?? tr??? l?? 0
          .limit(perPage)
          .sort({ createdAt: -1 })
          .exec((err, product) => {
            Product.countDocuments((err, count) => {
              if (err) return next(err);
              res.send({
                products: product,
                size: perPage,
                totalElements: count,
                totalPages: Math.ceil(count / perPage),
              }); // Tr??? v??? d??? li???u c??c s???n ph???m theo ?????nh d???ng nh?? JSON, XML,...
            });
          });
      } else {
        Product.find({
          name: { $regex: name, $options: "$i" },
        })
          .populate([
            { path: "category", select: "-products" },
            {
              path: "brand",
              select: "-products",
            },
            {
              path: "imageMulti",
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
          ])

          .skip(perPage * page - perPage) // Trong page ?????u ti??n s??? b??? qua gi?? tr??? l?? 0
          .limit(perPage)
          .sort({ createdAt: -1 })
          .exec((err, product) => {
            Product.countDocuments((err, count) => {
              if (err) return next(err);
              res.send({
                products: product,
                size: perPage,
                totalElements: count,
                totalPages: Math.ceil(count / perPage),
              }); // Tr??? v??? d??? li???u c??c s???n ph???m theo ?????nh d???ng nh?? JSON, XML,...
            });
          });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getDetailProduct: async (req, res) => {
    try {
      const { product_id } = req.query;
      const products = await Product.findOne({
        product_id,
      })
        .populate([
          { path: "category", select: "-products" },
          {
            path: "brand",
            select: "-products",
          },
          {
            path: "imageMulti",
          },
          {
            path: "colors",
            select: "-products",
          },
          {
            path: "typeProduct",
            select: "-products",
          },
        ])
        .sort({ createdAt: -1 });
      res.send({ products: products });
    } catch (error) {
      return res.status(500).json({ message: error.message });
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
        memory,
        imageMulti,
        display,
        colors,
        category_id,
        brand_id,
        typeProduct_id,
        soluong_sanpham,
        discount,
        content,
      } = parserData;
      const file = req.file;
      let imageUrl;
      let imagePublicId;
      if (file) {
        const uploadImage = await uploadToCloudinary(file, "products");
        if (!uploadImage.secure_url) {
          return res.status(500).send({ message: "T???i ???nh th???t b???i" });
        }
        imageUrl = uploadImage.secure_url;
        imagePublicId = uploadImage.public_id;
      }

      const product = await Product.findOne({ product_id });
      if (product) return res.status(400).send("M?? s???n ph???m ???? t???n t???i");
      const priceConvert = Number(price);
      const soluong_sanphamConvert = Number(soluong_sanpham);
      const convertDiscount = Number(discount);
      const price_discount = Math.ceil(
        priceConvert * ((100 - convertDiscount) / 100)
      );
      const newProductAndCategory = {
        name,
        product_id,
        price: priceConvert,
        display,
        memory,
        colors,
        imageMulti,
        content,
        image: imageUrl,
        imagePublicId: imagePublicId,
        brand: brand_id,
        category: category_id,
        typeProduct: typeProduct_id,
        soluong_sanpham: soluong_sanphamConvert,
        discount: convertDiscount,
        price_discount: price_discount,
      };
      const addProduct = await new Product(newProductAndCategory).save();
      await addProduct.populate([
        { path: "category", select: "-products" },
        {
          path: "colors",
          select: "-products",
        },
        {
          path: "image",
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
        message: "T???o s???n ph???m th??nh c??ng",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id, imagePublicId } = req.body;
      const cartOrder = await Order.find();
      let arrayTemp = [];
      cartOrder?.map((item) => {
        if (item.cart?.length > 0) {
          item?.cart?.filter((itemImage) => {
            arrayTemp.push(itemImage);
          });
        }
      });
      const findItem = arrayTemp?.filter(
        (item) => item.imagePublicId === imagePublicId
      );
      // const checkOrder = cartOrder.filter((item) =>
      //   item.cart.filter((cart) => cart.product_id === id)
      // );
      if (findItem.length > 0) {
        return res.status(500).send("S???n ph???m ???? ???????c ?????t h??ng, Kh??ng th??? x??a");
      }
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
      res.json({ message: "X??a s???n ph???m th??nh c??ng" });
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
        memory,
        display,
        colors,
        imageMulti,
        category_id,
        brand_id,
        typeProduct_id,
        soluong_sanpham,
        content,
        discount,
        ...field
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
      const priceConvert = Number(price);
      const soluong_sanphamConvert = Number(soluong_sanpham);
      const convertDiscount = Number(discount);
      const price_discount = Math.ceil(
        priceConvert * ((100 - convertDiscount) / 100)
      );
      const cloneProduct = {
        name,
        price: priceConvert,
        memory,
        display,
        colors,
        imageMulti,
        category: category_id,
        brand: brand_id,
        typeProduct: typeProduct_id,
        soluong_sanpham: soluong_sanphamConvert,
        discount: convertDiscount,
        content,
        ...field,
      };
      const product = await Product.findOneAndUpdate(
        { _id: id },
        {
          ...cloneProduct,
          image: imageUrl,
          imagePublicId: imagePublicId,
          price_discount: price_discount,
        },
        { new: true }
      );
      res.json({ product: product, message: "C???p nh???t s???n ph???m th??nh c??ng" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  ratingProduct: async (req, res) => {
    try {
      const random = Math.floor(Math.random() * 100);
      const { product_id, rating } = req.body;
      const productRate = await Product.findOne({ product_id: product_id });
      const { rate, totalRate, totalReview } = productRate;
      const newTotalRate = totalRate + rating;
      const newTotalReview = totalReview + 1;
      const newRating =
        rate === 0 ? newTotalRate : (newTotalRate / newTotalReview).toFixed(1);
      await Product.findOneAndUpdate(
        { product_id: product_id },
        {
          rate: newRating,
          totalRate: newTotalRate,
          totalReview: newTotalReview,
        },
        { new: true }
      );
      res.json({ rate: random, message: "????nh gi?? th??nh c??ng" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ProductCtrl;
