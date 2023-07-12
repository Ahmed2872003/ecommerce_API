const router = require("express").Router();

const { checkout } = require("../controller/payment.js");
const { createOrder } = require("../controller/order.js");
const { createOrderProducts } = require("../controller/orderProducts.js");

router.post("/", checkout);

module.exports = router;
