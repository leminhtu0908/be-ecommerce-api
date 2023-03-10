const multer = require("multer");
const AuthController = require("./controllers/AuthController");
const BannerCtrl = require("./controllers/BannerCtrl");
const BrandCtrl = require("./controllers/BrandCtrl");
const { CategoryCtrl } = require("./controllers/CategoryCtrl");
const ColorCtrl = require("./controllers/ColorCtrl");
const CommentCtrl = require("./controllers/CommentCtrl");
const DashboardController = require("./controllers/DashboardCtrl");
const ImageCtrl = require("./controllers/ImageCtrl");
const MemoryCtrl = require("./controllers/MemoryCtrl");
const NewCtrl = require("./controllers/NewCtrl");
const PaymentController = require("./controllers/PaymentController");
const ProductCtrl = require("./controllers/ProductCtrl");
const ProductDetailCtrl = require("./controllers/ProductDetailCtrl");
const TypeProductCtrl = require("./controllers/TypeProductCtrl");
const UserCtrl = require("./controllers/UserCtrl");
const { checkIfUser, checkIfAdmin } = require("./utils/projectedRoute");
const router = require("express").Router();

//Khi sử dụng bộ nhớ lưu trữ, thông tin tệp sẽ chứa một trường được gọi là bộ đệm chứa toàn bộ tệp.
const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

router.get("/", (req, res) => res.send("Hello API Ecommerce"));
/**
 * Authentication
 */
router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
/*
 *User
 */
router.put("/user/update", checkIfUser, UserCtrl.updateUser);
router.get("/user/all", checkIfAdmin, UserCtrl.getAllUser);
router.get("/user", checkIfUser, UserCtrl.getUserByEmail);
router.post("/userbyid", UserCtrl.getUserById);
router.post(
  "/user/upload-photo",
  [checkIfUser, multerUpload.single("image")],
  UserCtrl.uploadPhoto
);
/*
 *Category
 */
router.get("/category/all", CategoryCtrl.getAllCategories);
router.get("/category/findOne", CategoryCtrl.getCategory);
router.post("/category/create", checkIfAdmin, CategoryCtrl.createCategory);
router.delete(
  "/category/delete/:id",
  checkIfAdmin,
  CategoryCtrl.deleteCategory
);
router.put("/category/update", checkIfAdmin, CategoryCtrl.updateCategory);
router.get("/category/search", CategoryCtrl.searchCategory);

/*
 *Brand
 */
router.get("/brand/all", BrandCtrl.getAllBrand);
router.post("/brand/create", checkIfAdmin, BrandCtrl.createBrand);
router.delete("/brand/delete/:id", checkIfAdmin, BrandCtrl.deleteBrand);
router.put("/brand/update", checkIfAdmin, BrandCtrl.updateBrand);
/*
 *Type Product
 */
router.get("/type-product/all", TypeProductCtrl.getAllTypeProduct);
router.post(
  "/type-product/create",
  checkIfAdmin,
  TypeProductCtrl.createTypeProduct
);
router.delete(
  "/type-product/delete/:id",
  checkIfAdmin,
  TypeProductCtrl.deleteTypeProduct
);
router.put(
  "/type-product/update",
  checkIfAdmin,
  TypeProductCtrl.updateTypeProduct
);
/*
 *Color
 */
router.get("/color/all", ColorCtrl.getAllColor);
router.get("/colors", ColorCtrl.getColors);
router.post("/color/create", checkIfAdmin, ColorCtrl.createColor);
router.delete("/color/delete/:id", checkIfAdmin, ColorCtrl.deleteColor);
router.put("/color/update", checkIfAdmin, ColorCtrl.updateColor);
/*
 *Memory
 */
router.get("/memory/all", MemoryCtrl.getAllMemory);
router.post("/memory/create", checkIfAdmin, MemoryCtrl.createMemory);
router.delete("/memory/delete/:id", checkIfAdmin, MemoryCtrl.deleteMemory);
router.put("/memory/update", checkIfAdmin, MemoryCtrl.updateMemory);
/*
 *Image
 */
router.get("/image/all", ImageCtrl.getAllImage);
router.post(
  "/image/upload-photo",
  [checkIfAdmin, multerUpload.single("image")],
  ImageCtrl.upLoadImage
);
router.post(
  "/image/upload-multi",
  [checkIfAdmin, multerUpload.array("image")],
  ImageCtrl.upLoadMultiImage
);
router.post("/image/delete", checkIfAdmin, ImageCtrl.deleteImage);

/*
 *Banner
 */
router.get("/banner/all", BannerCtrl.getAllBanner);
router.post(
  "/banner/upload",
  [checkIfAdmin, multerUpload.single("image")],
  BannerCtrl.uploadBanner
);
router.post("/banner/delete", checkIfAdmin, BannerCtrl.deleteBanner);
/*
 *New
 */
router.get("/new/all", NewCtrl.getAllNew);
router.post(
  "/new/create",
  [checkIfAdmin, multerUpload.single("image")],
  NewCtrl.createNew
);
router.post("/new/delete", checkIfAdmin, NewCtrl.deleteNew);
router.put(
  "/new/update",
  [checkIfAdmin, multerUpload.single("image")],
  NewCtrl.updateNew
);
/*
 *Product
 */
router.get("/product", ProductCtrl.getAllProduct);
router.get("/product/detail", ProductCtrl.getDetailProduct);
router.get("/product/byname", ProductCtrl.getAllProductByName);
router.get("/product/byname-and-panigate", ProductCtrl.getProductsPanigate);
router.post(
  "/product/create",
  [checkIfAdmin, multerUpload.single("image")],
  ProductCtrl.createProduct
);
router.post("/product/delete", checkIfAdmin, ProductCtrl.deleteProduct);
router.put(
  "/product/update",
  [checkIfAdmin, multerUpload.single("image")],
  ProductCtrl.updateProduct
);
router.post("/product/rating", ProductCtrl.ratingProduct);
/*
 *ProductDetail
 */
router.get("/product-detail/all", ProductDetailCtrl.getAllProductDetail);
router.post(
  "/product-detail/create",
  checkIfAdmin,
  ProductDetailCtrl.createProductDetail
);
//  router.delete("/product/delete", checkIfAdmin, ProductCtrl.deleteProduct);
router.put(
  "/product-detail/update",
  checkIfAdmin,
  ProductDetailCtrl.updateProductDetail
);

/* Payment */
// router.post("/payment/vnpay", checkIfUser, PaymentController.getVNPay);
router.post("/payment/zalopay", checkIfUser, PaymentController.getZaloPay);
router.post(
  "/payment/status",
  checkIfUser,
  PaymentController.getStatusOrderCheckoutZalopay
);
router.post("/payment/cash", checkIfUser, PaymentController.createOrder);
router.post(
  "/payment/zalopay-saveorder",
  checkIfUser,
  PaymentController.createOrderZalopay
);
router.post("/payment/visited/cash", PaymentController.createOrderVisited);
router.get("/order/all", PaymentController.getAllOrder);
router.get("/order/by-user", PaymentController.getAllOrderByUser);
router.put(
  "/order/update-status",
  checkIfAdmin,
  PaymentController.updateStatusOrder
);
router.put(
  "/order/update-payment",
  checkIfAdmin,
  PaymentController.updatePayment
);
router.get("/order/export-excel", checkIfAdmin, PaymentController.ExportExCel);
router.post(
  "/order/delete",
  checkIfUser,
  PaymentController.deleteOrderWaitingAllow
);
router.post("/order/refund-money", checkIfUser, PaymentController.refundMoney);
router.post(
  "/order/all-apptransid",
  checkIfUser,
  PaymentController.getAllApptransid
);
router.post(
  "/order/update/refundid",
  checkIfUser,
  PaymentController.updateRefundID
);
router.post(
  "/order/status/refundid",
  checkIfUser,
  PaymentController.getStatusRefund
);

/* Comments */

router.get("/comment/all", CommentCtrl.getAllComments);
router.post("/comment/create", checkIfUser, CommentCtrl.createCommentUser);
router.put("/comment/update", checkIfUser, CommentCtrl.updateComment);
router.delete("/comment/delete/:id", checkIfUser, CommentCtrl.deleteComment);
//Reply comment
router.post("/comment/reply", checkIfUser, CommentCtrl.createReplyCommentUser);
router.put(
  "/comment/reply/update",
  checkIfUser,
  CommentCtrl.updateReplyCommentUser
);

/* Dashboard */
router.get("/dashboard", checkIfAdmin, DashboardController.getDashboard);
module.exports = router;
