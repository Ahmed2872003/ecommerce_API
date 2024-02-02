// Models
const Cart = require("../model/cart.js");
const Order = require("../model/order.js");
const Product = require("../model/product.js");
const CartItem = require("../model/cart_items.js");

const createOrder = async (req) => {
  const {
    details: { subtotal, shipping_amount, total_amount },
    status,
  } = req.paymentDetails;

  const cart = await Cart.findOne({
    where: { CustomerId: req.customer.id },
    include: { model: Product, through: { model: CartItem } },
  });

  const order = await Order.create({
    CustomerId: req.customer.id,
    subtotal,
    shipping_amount,
    total_amount,
    status,
  });

  req.order = order;
  req.cartId = cart.getDataValue("id");
};

module.exports = { createOrder };
