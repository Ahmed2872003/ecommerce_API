const router = require("express").Router();

const { createOrder, confirmOrder } = require("../controller/order.js");
const {
  createOrderProducts,
  getOrderProducts,
} = require("../controller/orderProducts.js");

const { deleteCart } = require("../controller/cart.js");

router
  .route("/")
  .post(createOrder, createOrderProducts, deleteCart)
  .get(getOrderProducts);

module.exports = router;
