const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Models
// Models
const Cart = require("../model/cart.js");
const CartItem = require("../model/cart_items.js");
const Product = require("../model/product.js");

// Utility
const findCart = require("../utility/getCart.js");

// Errors
const BadRequestError = require("../errors/badRequest");

const checkout = async (req, res, next) => {
  const cart = await findCart(req.customer.id);

  if (!cart)
    throw new BadRequestError("No products have been added to the cart yet.");

  const { subtotal } = cart.dataValues;

  const payment = await stripe.charges.create({
    amount: subtotal * 100,
    currency: "usd",
    source: req.body["btoken"],
  });

  req.cart = cart;

  next();
};

module.exports = { checkout };
