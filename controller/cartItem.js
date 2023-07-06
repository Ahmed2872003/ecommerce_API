const { StatusCodes } = require("http-status-codes");

// Models
const CartItem = require("../model/cart_items");
const Cart = require("../model/cart.js");
const Product = require("../model/product.js");
// Errors
const NotFoundError = require("../errors/notFound.js");

const updateSubtotal = require("../utility/updateSubtotal.js");

const { col } = require("sequelize");

const addCartItem = async (req, res, next) => {
  const { productId: ProductId, quantity } = req.body;

  const product = await Product.findByPk(ProductId, {
    attributes: ["price", "quantity"],
  });

  if (!product) throw new NotFoundError("product", ProductId);

  if (quantity > product.getDataValue("quantity"))
    throw new BadRequestError(
      `This seller has only ${product.getDataValue(
        "quantity"
      )} of these available.`
    );

  await CartItem.create({
    CartId: req.cart.getDataValue("id"),
    ProductId,
    quantity,
  });

  req.product = product;

  next();
};

const updateCartItem = async (req, res, next) => {
  const { productId: ProductId, quantity } = req.body;

  const { id, subtotal } = req.cart;

  await CartItem.update({ quantity }, { where: { ProductId, CartId: id } });

  res.status(StatusCodes.OK).json({ data: { subtotal } });
};

const deleteCartItem = async (req, res, next) => {
  const { productId: ProductId } = req.body;

  const {
    cart: { id: CartId },
  } = await updateSubtotal(req.customer.id, ProductId, 0);

  await CartItem.destroy({ where: { CartId, ProductId } });

  res.sendStatus(StatusCodes.OK);
};

module.exports = { addCartItem, updateCartItem, deleteCartItem };
