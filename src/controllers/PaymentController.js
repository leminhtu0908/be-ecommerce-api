const axios = require("axios"); // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const dateFormat = require("dateformat");
const Order = require("../models/orderModel");
const xlsx = require("xlsx");
const path = require("path");
const User = require("../models/userModel");
const fs = require("fs");
const Product = require("../models/productModel");
const qs = require("qs");
const { orderStatus } = require("../constants/type");
// // APP INFO
// const configURL = {
//   vnp_TmnCode: "UDOPNWS1",
//   vnp_HashSecret:
//     "3e0d61a0c0534b2e36680b3f7277743e8784cc4e1d68fa7d276e79c23be7d6318d338b477910a27992f5057bb1582bd44bd82ae8009ffaf6d141219218625c42",
//   vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
//   vnp_ReturnUrl: "https://lmt-shop.vercel.app/order/vnpay_return",
// };
// Date.prototype.YYYYMMDDHHMMSS = function () {
//   var yyyy = this.getFullYear().toString();
//   var MM = pad(this.getMonth() + 1, 2);
//   var dd = pad(this.getDate(), 2);
//   var hh = pad(this.getHours(), 2);
//   var mm = pad(this.getMinutes(), 2);
//   var ss = pad(this.getSeconds(), 2);

//   return yyyy + MM + dd + hh + mm + ss;
// };
// function pad(number, length) {
//   var str = "" + number;
//   while (str.length < length) {
//     str = "0" + str;
//   }
//   return str;
// }
const PaymentController = {
  // getVNPay: async (req, res) => {
  //   try {
  //     var ipAddr =
  //       req.headers["x-forwarded-for"] ||
  //       req.connection.remoteAddress ||
  //       req.socket.remoteAddress ||
  //       req.connection.socket.remoteAddress;

  //     var tmnCode = configURL.vnp_TmnCode;
  //     var secretKey = configURL.vnp_HashSecret;
  //     var vnpUrl = configURL.vnp_Url;
  //     var returnUrl = configURL.vnp_ReturnUrl;
  //     date = new Date();

  //     const dateExpr = moment(new Date()).add(30, "m").toDate();
  //     const createDate = date.YYYYMMDDHHMMSS();
  //     const createDateExpr = dateExpr.YYYYMMDDHHMMSS();

  //     var orderId = req.body.transID;
  //     var amount = req.body.amount;
  //     var bankCode = req.body.bankCode;
  //     var orderInfo = req.body.orderDescription;
  //     var orderType = req.body.orderType;
  //     var locale = req.body.language;
  //     if (locale === null || locale === "") {
  //       locale = "vn";
  //     }
  //     var currCode = "VND";
  //     var vnp_Params = {};
  //     vnp_Params["vnp_Version"] = "2.1.0";
  //     vnp_Params["vnp_Command"] = "pay";
  //     vnp_Params["vnp_TmnCode"] = tmnCode;
  //     vnp_Params["vnp_Amount"] = amount * 100;
  //     // vnp_Params['vnp_Merchant'] = ''
  //     if (bankCode !== null && bankCode !== "") {
  //       vnp_Params["vnp_BankCode"] = bankCode;
  //     }
  //     vnp_Params["vnp_CreateDate"] = createDate;
  //     vnp_Params["vnp_CurrCode"] = currCode;
  //     vnp_Params["vnp_IpAddr"] = ipAddr;
  //     vnp_Params["vnp_Locale"] = locale;
  //     vnp_Params["vnp_OrderInfo"] = orderInfo;
  //     vnp_Params["vnp_OrderType"] = orderType;
  //     vnp_Params["vnp_ReturnUrl"] = returnUrl;
  //     vnp_Params["vnp_TxnRef"] = orderId;
  //     vnp_Params["vnp_ExpireDate"] = createDateExpr;
  //     vnp_Params = sortObject(vnp_Params);

  //     var querystring = require("qs");
  //     const signData = querystring.stringify(vnp_Params, { encode: false });
  //     var crypto = require("crypto");
  //     var hmac = crypto.createHmac("sha512", secretKey);
  //     var signed = hmac
  //       .update(new Buffer.from(signData, "utf-8"))
  //       .digest("hex");
  //     vnp_Params["vnp_SecureHash"] = signed;
  //     vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
  //     res.json({ data: vnp_Params, url: vnpUrl, status: "success" });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
  // getZaloPay: async (req, res) => {
  //   console.log(req.body);
  //   const { amount, name, cart, transID } = req.body;
  //   const config = {
  //     app_id: "2553",
  //     key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  //     key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  //     endpoint: "https://sbgateway.zalopay.vn/api/getlistmerchantbanks",
  //   };

  //   const embed_data = {
  //     promotioninfo: "",
  //     merchantinfo: "embeddata123",
  //     bankgroup: "ATM",
  //   };

  //   const items = [{}];
  //   // const transID = Math.floor(Math.random() * 1000000);
  //   const order = {
  //     app_id: config.app_id,
  //     app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
  //     app_user: name,
  //     app_time: Date.now(), // miliseconds
  //     item: JSON.stringify(cart),
  //     embed_data: JSON.stringify(embed_data),
  //     amount: amount,
  //     description: `Lazada - Payment for the order #${transID}`,
  //     bank_code: "",
  //   };

  //   // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  //   const data =
  //     config.app_id +
  //     "|" +
  //     order.app_trans_id +
  //     "|" +
  //     order.app_user +
  //     "|" +
  //     order.amount +
  //     "|" +
  //     order.app_time +
  //     "|" +
  //     order.embed_data +
  //     "|" +
  //     order.item;
  //   order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  //   const fetchApi = async () => {
  //     const response = await axios
  //       .post(config.endpoint, null, { params: order })
  //       .then((res) => {
  //         return res.data;
  //       })
  //       .catch((err) => console.log(err));
  //     return response;
  //   };
  //   try {
  //     const data = await fetchApi();
  //     console.log(data);
  //     res.send(data);
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
  getZaloPay: async (req, res) => {
    // APP INFO
    const config = {
      appid: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder",
    };

    const embed_data = {
      promotioninfo: "",
      merchantinfo: "embeddata123",
      redirecturl: `${process.env.API_URL_PRO}/order-status`,
      bankgroup: "ATM",
      zlppaymentid: "MT09082000",
    };

    // const items = [
    //   {
    //     itemid: "knb",
    //     itename: "kim nguyen bao",
    //     itemprice: 198400,
    //     itemquantity: 1,
    //   },
    // ];
    // const transID = Math.floor(Math.random() * 1000000);
    const order = {
      appid: config.appid,
      apptransid: `${moment().format("YYMMDD")}_${req.body.transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      appuser: req.body.name,
      apptime: Date.now(), // miliseconds
      item: JSON.stringify(req.body.cart),
      embeddata: JSON.stringify(embed_data),
      amount: req.body.amount,
      description: `Thanh to??n cho ????n h??ng #${req.body.transID}`,
      bankcode: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.appid +
      "|" +
      order.apptransid +
      "|" +
      order.appuser +
      "|" +
      order.amount +
      "|" +
      order.apptime +
      "|" +
      order.embeddata +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    // axios
    //   .post(config.endpoint, null, { params: order })
    //   .then((response) => {
    //     res.json({ data: response.data });
    //   })
    //   .catch((err) => console.log(err));
    try {
      const response = await axios
        .post(config.endpoint, null, { params: order })
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
      res.json({ data: response });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getStatusOrderCheckoutZalopay: async (req, res) => {
    const config = {
      appid: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid",
    };

    let postData = {
      appid: config.appid,
      apptransid: req.body.apptransid, // Input your apptransid
    };

    let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
      method: "post",
      url: config.endpoint,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };
    const responseData = await axios(postConfig)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    res.json({ data: responseData });
  },

  getAllOrder: async (req, res) => {
    try {
      const { allow_status } = req.query;
      if (allow_status === "") {
        const data = await Order.find().populate("user").sort({
          createdAt: -1,
        });
        res.send(data);
      } else {
        const data = await Order.find({ allow_status: allow_status })
          .populate("user")
          .sort({
            createdAt: -1,
          });
        res.send(data);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAllOrderByUser: async (req, res) => {
    try {
      const { orderId } = req.query;
      if (orderId === "") {
        const data = await Order.find()
          .populate([{ path: "user", select: "_id" }])
          .sort({ createdAt: -1 });
        res.send(data);
      } else {
        const data = await Order.find({
          order_id: { $regex: orderId, $options: "$i" },
        })
          .populate([{ path: "user", select: "_id" }])
          .sort({
            createdAt: -1,
          });
        res.send(data);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    // try {
    //   const userid = req.params.userid;
    //   let perPage = req.query.per_page || 10; // s??? l?????ng s???n ph???m xu???t hi???n tr??n 1 page
    //   let page = req.query.current_page || 0;
    //   Order.find()
    //     .populate([{ path: "user", select: "_id" }]) // find t???t c??? c??c data
    //     .skip(perPage * page - perPage) // Trong page ?????u ti??n s??? b??? qua gi?? tr??? l?? 0
    //     .limit(perPage)
    //     .sort({
    //       createdAt: -1,
    //     })
    //     .exec((err, order) => {
    //       Order.countDocuments((err, count) => {
    //         if (err) return next(err);
    //         res.send({
    //           content: order,
    //           size: perPage,
    //           totalElements: count,
    //           totalPages: Math.ceil(count / perPage),
    //         }); // Tr??? v??? d??? li???u c??c s???n ph???m theo ?????nh d???ng nh?? JSON, XML,...
    //       });
    //     });
    // } catch (error) {
    //   return res.status(500).json({ message: error.message });
    // }
  },
  getAllApptransid: async (req, res) => {
    try {
      const { user_id } = req.body;
      const order = await Order.find()
        .populate([{ path: "user", select: "_id" }])
        .sort({
          createdAt: -1,
        });
      const findUser = order?.filter(
        (item) => item.user.id === user_id && item.isPayment === true
      );
      let newData = [];
      findUser.map((item) => {
        newData.push({ apptransid: item.apptransid });
      });
      res.json({ data: newData });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getStatusRefund: async (req, res) => {
    try {
      // const config = {
      //   appid: "2553",
      //   key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      //   key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      //   endpoint:
      //     "https://sandbox.zalopay.com.vn/v001/tpe/getpartialrefundstatus",
      // };

      // const params = {
      //   appid: config.appid,
      //   timestamp: Date.now(), // miliseconds
      //   mrefundid: req.body.mrefundid,
      // };

      // const data =
      //   config.appid + "|" + params.mrefundid + "|" + params.timestamp; // appid|mrefundid|timestamp
      // params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      // const response = axios
      //   .get(config.endpoint, { params })
      //   .then((res) => {
      //     console.log(res.data);
      //     return res.data;
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      // res.json({ data: response });
      const config = {
        appid: "553",
        key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
        key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
        // endpoint: "https://sb-openapi.zalopay.vn/v2/query_refund",
        endpoint:
          "https://sandbox.zalopay.com.vn/v001/tpe/getpartialrefundstatus",
      };

      const params = {
        appid: config.appid,
        timestamp: Date.now(), // miliseconds
        mrefundid: req.body.mrefundid,
        // mrefundid: "221230_000_000002",
      };
      const data =
        config.appid + "|" + params.mrefundid + "|" + params.timestamp; // app_id|m_refund_id|timestamp
      params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
      const response = await axios
        .get(config.endpoint, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
      res.json({ data: response });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createOrder: async (req, res) => {
    try {
      const {
        order_id,
        tinh,
        huyen,
        name,
        email,
        phone,
        sonha,
        xa,
        product_total,
        price_total,
        cart,
        status,
        user_id,
      } = req.body;
      const address = `${sonha},${xa}, ${huyen}, ${tinh}`;
      let cartInfo = [];
      cart?.map((item) => {
        cartInfo.push(item.name);
        cartInfo.push(item.memory);
        cartInfo.push(item.colors);
        cartInfo.push(item.product_id);
      });
      const convertCartObject = cartInfo.reduce(
        (a, v, index) => ({ ...a, [`key_${index}`]: v }),
        {}
      );
      const { key_0, key_1, key_2, key_3 } = convertCartObject;
      const productNameOrder = `${key_0} - ${key_1} - ${key_2}`;
      const cloneValues = {
        order_id: order_id,
        product_id: key_3,
        productNameOrder: productNameOrder,
        fullName: name,
        phone: phone,
        email: email,
        address: address,
        total_product: product_total,
        total_price: price_total,
        price_pay_remaining: price_total,
        allow_status: status,
        user: user_id,
        cart: cart,
        isPayment: false,
      };
      const newOrder = new Order(cloneValues);
      await newOrder.save();
      await newOrder.populate("user");
      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $push: { order: newOrder },
        }
      );
      res.json({ newOrder: newOrder, status: "success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createOrderZalopay: async (req, res) => {
    console.log(req.body);
    try {
      const {
        order_id,
        tinh,
        huyen,
        name,
        email,
        phone,
        sonha,
        xa,
        product_total,
        price_total,
        cart,
        status,
        user_id,
        apptransid,
      } = req.body;
      const findOrderID = await Order.findOne({ order_id: order_id });
      if (findOrderID?.length > 0) {
        return;
      }
      const address = `${sonha},${xa}, ${huyen}, ${tinh}`;
      let cartInfo = [];
      cart?.map((item) => {
        cartInfo.push(item.name);
        cartInfo.push(item.memory);
        cartInfo.push(item.colors);
        cartInfo.push(item.product_id);
      });
      const convertCartObject = cartInfo.reduce(
        (a, v, index) => ({ ...a, [`key_${index}`]: v }),
        {}
      );
      const { key_0, key_1, key_2, key_3 } = convertCartObject;
      const productNameOrder = `${key_0} - ${key_1} - ${key_2}`;
      const cloneValues = {
        order_id: order_id,
        product_id: key_3,
        productNameOrder: productNameOrder,
        fullName: name,
        phone: phone,
        email: email,
        address: address,
        total_product: product_total,
        total_price: price_total,
        price_pay_remaining: price_total,
        allow_status: status,
        user: user_id,
        cart: cart,
        orderStatus: orderStatus.zalopay,
        isPayment: true,
        apptransid: apptransid,
      };
      const newOrder = new Order(cloneValues);
      await newOrder.save();
      await newOrder.populate("user");
      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $push: { order: newOrder },
        }
      );
      res.json({ newOrder: newOrder, status: "success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createOrderVisited: async (req, res) => {
    try {
      const {
        order_id,
        tinh,
        huyen,
        name,
        email,
        phone,
        sonha,
        xa,
        product_total,
        price_total,
        cart,
        status,
      } = req.body;
      const address = `${sonha},${xa}, ${huyen}, ${tinh}`;
      const { memory, colors } = cart;

      const productNameOrder = `${name} - ${memory} - ${colors}`;
      const cloneValues = {
        order_id: order_id,
        productNameOrder: productNameOrder,
        fullName: name,
        phone: phone,
        email: email,
        address: address,
        total_product: product_total,
        total_price: price_total,
        allow_status: status,
        visited: true,
      };
      const newOrder = new Order(cloneValues);
      await newOrder.save();
      res.json({ newOrder: newOrder, status: "success" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateStatusOrder: async (req, res) => {
    try {
      const { allow_status, id, product_id, soldTotal } = req.body;
      const product = await Product.findOne({ product_id: product_id });
      const { sold } = product;
      const orderUpdate = await Order.findOneAndUpdate(
        { _id: id },
        { allow_status },
        { new: true }
      );
      await Product.findOneAndUpdate(
        { product_id: product_id },
        { sold: sold + soldTotal },
        { new: true }
      );
      res.json({ order: orderUpdate, message: " Duy???t th??nh c??ng" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updatePayment: async (req, res) => {
    try {
      const { order_id, price_pay } = req.body;
      const order = await Order.findOne({ order_id: order_id });
      const { total_price } = order;
      const price_pay_remaining = total_price - Number(price_pay);
      const orderUpdatePay = await Order.findOneAndUpdate(
        { order_id: order_id },
        { price_pay, price_pay_remaining },
        { new: true }
      );
      res.json({
        order: orderUpdatePay,
        message: "C???p nh???t thanh to??n th??nh c??ng",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateRefundID: async (req, res) => {
    try {
      const { apptransid, mrefundid } = req.body;
      const orderUpdate = await Order.findOneAndUpdate(
        { apptransid: apptransid },
        { mrefundid: mrefundid },
        { new: true }
      );
      res.json({ data: orderUpdate });
    } catch (error) {
      return res.status(500).json({ message: err.message });
    }
  },
  ExportExCel: async (req, res) => {
    try {
      const orders = await Order.find();
      const workSheetColumnNames = [
        "M?? ????n h??ng",
        "T??n ????n h??ng",
        "T??n ng?????i nh???n",
        "S??? ??i???n tho???i",
        "Email",
        "?????a ch???",
        "S??? l?????ng s???n ph???m",
        "T???ng ti???n",
        "Th???i gian ?????t h??ng",
        "H??nh th???c thanh to??n",
        "T??nh tr???ng ????n h??ng",
      ];
      const workSheetName = "????n ?????t h??ng";
      const data = orders.map((order) => {
        return [
          order.order_id,
          order.productNameOrder,
          order.fullName,
          order.phone,
          order.email,
          order.address,
          order.total_product,
          order.total_price,
          order.createdAt,
          order.orderStatus,
          order.allow_status === 1
            ? "???? duy???t"
            : order.allow_status === 0
            ? "??ang ?????i duy???t"
            : "???? h???y",
        ];
      });
      const exportPath = path.join(__dirname, `../tmp/order.xlsx`);
      const workSheetData = [workSheetColumnNames, ...data];
      const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
      const workBook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
      xlsx.write(workBook, { bookType: "xlsx", type: "buffer" });
      xlsx.write(workBook, { bookType: "xlsx", type: "binary" });
      xlsx.writeFile(workBook, exportPath);
      res.setHeader("Content-Type", "application/force-download");
      res.setHeader("Content-Disposition", "attachment;filename=order.xlsx");
      res.download(exportPath, function (err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        fs.unlinkSync(exportPath);
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteOrderWaitingAllow: async (req, res) => {
    try {
      const { id } = req.body;
      await Order.findOneAndUpdate(
        { _id: id },
        { allow_status: 2 },
        { new: true }
      );
      res.json({ message: "H???y ????n h??ng th??nh c??ng" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  refundMoney: async (req, res) => {
    try {
      const config = {
        appid: "2553",
        key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
        key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
        endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/partialrefund",
      };

      const timestamp = Date.now();
      const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id

      let params = {
        appid: config.appid,
        mrefundid: `${moment().format("YYMMDD")}_${config.appid}_${uid}`,
        timestamp, // miliseconds
        zptransid: req.body.zp_trans_id,
        amount: req.body.amount,
        description: "ZaloPay Refund Demo",
      };

      // app_id|zp_trans_id|amount|description|timestamp
      let data =
        params.appid +
        "|" +
        params.zptransid +
        "|" +
        params.amount +
        "|" +
        params.description +
        "|" +
        params.timestamp;
      params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
      const responseData = await axios
        .post(config.endpoint, null, { params })
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));

      res.json({ data: responseData });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
module.exports = PaymentController;
