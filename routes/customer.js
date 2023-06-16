const router = require("express").Router();

const { createCustomer } = require("../controller/customer.js");

router.post("/", createCustomer);

module.exports = router;
