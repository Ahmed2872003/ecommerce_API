const router = require("express").Router();

const {
  updateCustomer,
  getCustomer,
  sendEmailConf,
} = require("../controller/customer.js");

router.patch("/", updateCustomer);

router.get("/", getCustomer);

module.exports = router;
