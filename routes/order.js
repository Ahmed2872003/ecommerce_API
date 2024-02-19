const router = require("express").Router();

const { getOrderProducts } = require("../controller/orderProducts.js");

router.route("/").get(getOrderProducts);

module.exports = router;
