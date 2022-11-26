const axios = require("axios"); // npm install axios
const CryptoJS = require("crypto-js"); // npm install crypto-js
const moment = require("moment"); // npm install moment
const Order = require("../models/orderModel");
const xlsx = require("xlsx");
const path = require("path");
const User = require("../models/userModel");
const fs = require("fs");
// APP INFO

const PaymentController = {
  getZaloPay: async (req, res) => {
    console.log(req.body);
    const { amount, name, cart, transID } = req.body;
    const config = {
      app_id: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    };

    const embed_data = {};

    const items = [{}];
    // const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: name,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(cart),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "zalopayapp",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    const fetchApi = async () => {
      const response = await axios
        .post(config.endpoint, null, { params: order })
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
      return response;
    };
    try {
      const data = await fetchApi();
      res.send(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
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
      const data = await Order.find()
        .populate([{ path: "user", select: "_id" }])
        .sort({
          createdAt: -1,
        });
      res.send(data);
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
        cartInfo.push(item.memorys);
        cartInfo.push(item.colors);
      });
      const convertCartObject = cartInfo.reduce(
        (a, v, index) => ({ ...a, [`key_${index}`]: v }),
        {}
      );
      const { key_0, key_1, key_2 } = convertCartObject;
      const productNameOrder = `${key_0} - ${key_1} - ${key_2}`;
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
        user: user_id,
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
  updateStatusOrder: async (req, res) => {
    try {
      const { allow_status, id, user_id } = req.body;
      await User.findOneAndUpdate(
        { _id: user_id },
        {
          $set: { "order.$[elem].allow_status": allow_status },
        },
        {
          arrayFilters: [{ "elem.order": { allow_status: allow_status } }],
          new: true,
        }
      );
      const orderUpdate = await Order.findOneAndUpdate(
        { _id: id },
        { allow_status },
        { new: true }
      );
      res.json({ order: orderUpdate, message: " Duyệt thành công" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  ExportExCel: async (req, res) => {
    try {
      const orders = await Order.find();
      const workSheetColumnNames = [
        "Mã đơn hàng",
        "Tên đơn hàng",
        "Tên người nhận",
        "Số điện thoại",
        "Email",
        "Địa chỉ",
        "Số lượng sản phẩm",
        "Tổng tiền",
        "Thời gian đặt hàng",
        "Tình trạng đơn hàng",
      ];
      const workSheetName = "Đơn đặt hàng";
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
          order.allow_status === true ? "Đã duyệt" : "Đang đợi duyệt",
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
      res.setHeader("Content-Disposition", "attachment;filename=" + exportPath);
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
      const order = await Order.findOne({ _id: id });
      if (order.allow_status === true) {
        res
          .status(400)
          .send("Đơn hàng của bạn đã được duyệt, Không thể hủy đơn hàng");
      } else if (order.allow_status === false) {
        await Order.findByIdAndDelete(id);
        res.json({ message: "Hủy đơn hàng thành công" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = PaymentController;
