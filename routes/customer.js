const router = require("express").Router();

const { updateCustomer } = require("../controller/customer.js");

router.post("/", updateCustomer);

module.exports = router;
