const router = require("express").Router();

const iSeller = require("../middleware/isSeller.js");

const {
  getCustomerOrderProducts,
  getIncomingOrderProducts,
} = require("../controller/orderProducts.js");

router.route("/").get(getCustomerOrderProducts);

router.get("/incoming", iSeller, getIncomingOrderProducts);

module.exports = router;
