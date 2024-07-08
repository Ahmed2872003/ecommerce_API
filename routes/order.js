const router = require("express").Router();

const {
  getCustomerOrderProducts,
  getSellerOrderProoducts,
} = require("../controller/orderProducts.js");

router.route("/").get(getCustomerOrderProducts);

router.get("/seller", getSellerOrderProoducts);

module.exports = router;
