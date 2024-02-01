// Models
const Order = require("../model/order.js");
const Cart = require("../model/cart.js");
const Product = require("../model/product.js");
const cartItem = require("../model/cart_items.js");
const orderProduct = require("../model/order_products.js");

// Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Errors
const BadRequest = require("../errors/badRequest.js");
const notFound = require("../errors/notFound.js");
const CustomApiError = require("../errors/custom.js");
const { StatusCodes } = require("http-status-codes");

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

module.exports = { createOrder };
