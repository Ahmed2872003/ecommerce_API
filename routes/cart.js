const router = require("express").Router();

const { addToCart, updateCart } = require("../controller/cart.js");

router.route("/").post(addToCart).patch(updateCart);

module.exports = router;
