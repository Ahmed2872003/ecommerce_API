const router = require("express").Router();

const {
  addToCart,
  updateCart,
  updateCartItem,
  getCart,
  deleteCart
} = require("../controller/cart.js");

router.route("/").post(addToCart).patch(updateCart, updateCartItem).get(getCart).delete(deleteCart);

module.exports = router;
