// Models
const Order = require("../model/order.js");
const Cart = require("../model/cart.js");
const Product = require("../model/product.js");
const cartItem = require("../model/cart_items.js");

// Errors
const BadRequest = require("../errors/badRequest.js");

const createOrder = async (req, res, next) => {
  const cart = await Cart.findOne({
    where: { CustomerId: req.customer.id },
    include: { model: Product, through: { model: cartItem } },
  });

  if (!cart || !cart.getDataValue("Products").length)
    throw new BadRequest("No items have been added to the cart yet.");

  const order = await Order.create({
    CustomerId: req.customer.id,
    total_amount: cart.getDataValue("subtotal"),
  });

  req.order = order;
  req.cartId = cart.getDataValue("id");

  next();
};

const deleteOrder = async (req, res, next) => {
  await Order.destroy({ where: { id: req.params.orderId } });

  res.sendStatus(200);
};

module.exports = { createOrder, deleteOrder };
