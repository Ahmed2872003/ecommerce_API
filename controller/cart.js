const Cart = require("../model/cart.js");

const CartItem = require("../model/cart_items.js");

const Product = require("../model/product.js");

const NotFoundError = require("../errors/notFound.js");
const CustomApiError = require("../errors/custom.js");

const { StatusCodes } = require("http-status-codes");

const addToCart = async (req, res, next) => {
  const { productId: ProductId, quantity } = req.body;

  let cart = await Cart.findOne({ where: { CustomerId: req.customerId } });

  //   Create a cart if not exist
  if (!cart) {
    cart = await Cart.create({ CustomerId: req.customerId });
  }
  const cartId = cart.getDataValue("id");

  await CartItem.create({
    CartId: cartId,
    ProductId,
    quantity,
  });

  const product = await Product.findByPk(ProductId, { attributes: ["price"] });

  if (!product) throw new NotFoundError("product", ProductId);

  await cart.update({
    subtotal:
      cart.getDataValue("subtotal") + product.getDataValue("price") * +quantity,
  });

  res.sendStatus(StatusCodes.OK);
};

const updateCart = async (req, res, next) => {
  const { productId: ProductId, quantity } = req.body;

  const cart = await Cart.findOne({ where: { CustomerId: req.customerId } });

  const cartItem = await CartItem.findOne({
    where: { CartId: cart.getDataValue("id"), ProductId },
  });

  if (!cartItem)
    throw new CustomApiError(
      "you should add that product to cart first",
      StatusCodes.BAD_REQUEST
    );

  const product = await Product.findByPk(ProductId, { attributes: ["price"] });

  if (!product) throw new NotFoundError("product", ProductId);

  const oldQuantity = cartItem.getDataValue("quantity");

  const productPrice = product.getDataValue("price");

  await cartItem.update({ quantity });

  const newSubTotal =
    cart.getDataValue("subtotal") - productPrice * (oldQuantity - +quantity);

  await cart.update({ subtotal: newSubTotal });

  res.sendStatus(StatusCodes.OK);
};

module.exports = { addToCart, updateCart };
