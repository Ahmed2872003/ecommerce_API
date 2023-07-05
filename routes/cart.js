const router = require("express").Router();

const {
  createCart,
  addToCart,
  updateCart,
  getCart,
  deleteCart,
} = require("../controller/cart.js");

const {
  addCartItem,
  updateCartItem,
  deleteCartItem,
} = require("../controller/cartItem.js");

router
  .route("/")
  .post(createCart, addCartItem, addToCart)
  .patch(updateCart, updateCartItem)
  .get(getCart)
  .delete(deleteCart);

router.route("/item").delete(deleteCartItem);

module.exports = router;
