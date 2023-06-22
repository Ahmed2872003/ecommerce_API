const router = require("express").Router();

const { updateCustomer } = require("../controller/customer.js");

router.patch("/", updateCustomer);

module.exports = router;
