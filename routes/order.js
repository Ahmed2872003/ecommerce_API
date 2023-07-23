const router = require("express").Router();

const { createOrder, confirmOrder } = require("../controller/order.js");
const {
  createOrderProducts,
  getOrderProducts,
} = require("../controller/orderProducts.js");

router.route("/").post(createOrder, createOrderProducts).get(getOrderProducts);

router.post("/confirm", confirmOrder);

module.exports = router;
