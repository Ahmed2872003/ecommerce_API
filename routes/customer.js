const router = require("express").Router();

const { updateCustomer, getCustomer } = require("../controller/customer.js");

router.patch("/", updateCustomer);

router.get("/", getCustomer);

module.exports = router;
