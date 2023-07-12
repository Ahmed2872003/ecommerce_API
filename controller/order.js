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

const { col, literal } = require("sequelize");

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

const confirmOrder = async (req, res, next) => {
  const { btoken, id } = req.body;

  if (!btoken || !id)
    throw new BadRequest("Must provide bank token and order id");

  const order = await Order.findOne({
    where: { id },
    include: {
      model: Product,
      attributes: [
        "id",
        "quantity",
        [literal("`Products->orderProduct`.`quantity`"), "orderedQuantity"],
      ],
      through: { model: orderProduct, attributes: [] },
    },
  });

  if (!order) throw new notFound("order", id);

  if (order.getDataValue("status"))
    throw new CustomApiError(
      "that order has been confirmed before.",
      StatusCodes.CONFLICT
    );

  const payment = await stripe.charges.create({
    amount: order.getDataValue("total_amount") * 100,
    currency: "usd",
    source: req.body["btoken"],
  });

  await order.update({ status: true });

  for (const product of order.getDataValue("Products")) {
    const { quantity, orderedQuantity } = product.dataValues;
    await product.update({ quantity: quantity - orderedQuantity });
  }

  res.sendStatus(200);
};

module.exports = { createOrder, deleteOrder, confirmOrder };
