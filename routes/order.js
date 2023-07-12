const router = require("express").Router();

const { createOrder, deleteOrder } = require("../controller/order.js");
const {
  createOrderProducts,
  getOrderProducts,
} = require("../controller/orderProducts.js");

router.route("/").post(createOrder, createOrderProducts).get(getOrderProducts);

router.route("/:orderId").delete(deleteOrder);

module.exports = router;
