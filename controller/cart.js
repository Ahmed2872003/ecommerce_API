// Models
const Cart = require("../model/cart.js");
const CartItem = require("../model/cart_items.js");
const Product = require("../model/product.js");

// Errors
const NotFoundError = require("../errors/notFound.js");
const BadRequestError = require("../errors/badRequest.js");

const { StatusCodes } = require("http-status-codes");

// utility
const updateSubtotal = require("../utility/updateSubtotal.js");
const findCart = require("../utility/getCart.js");

const createCart = async (req, res, next) => {
  const { id: CustomerId } = req.customer;
  let cart = await Cart.findOne({ where: { CustomerId } });

  //   Create a cart if not exist
  if (!cart) {
    cart = await Cart.create({ CustomerId });
  }

  req.cart = cart;

  next();
};

const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const cart = req.cart;
  const product = req.product;

  await cart.update({
    subtotal:
      cart.getDataValue("subtotal") + product.getDataValue("price") * +quantity,
  });

  res.sendStatus(StatusCodes.OK);
};

const updateCart = async (req, res, next) => {
  const { productId, quantity: neededQuantity } = req.body;

  if (!productId || !neededQuantity)
    throw new BadRequestError("Must provide both productId and quantity");
  if (neededQuantity <= 0)
    throw new BadRequestError("quantity must be positive");

  const {
    cart: { id, subtotal },
    newSubtotal,
  } = await updateSubtotal(req.customer.id, productId, neededQuantity);

  req.cart = { id, subtotal: newSubtotal };

  next();
};

const getCart = async (req, res, next) => {
  let cart = await findCart(req.customer.id);

  if (!cart) cart = { subtotal: 0, Products: [] };

  res.status(StatusCodes.OK).json({ data: { cart } });
};

const deleteCart = async (req, res, next) => {
  const cart = await Cart.destroy({ where: { CustomerId: req.customer.id } });

  res.sendStatus(StatusCodes.OK);
};

module.exports = { createCart, addToCart, updateCart, getCart, deleteCart };
