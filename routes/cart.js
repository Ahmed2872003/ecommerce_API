const router = require("express").Router();

const {
  addToCart,
  updateCart,
  updateCartItem,
  getCart
} = require("../controller/cart.js");

router.route("/").post(addToCart).patch(updateCart, updateCartItem).get(getCart);

module.exports = router;
