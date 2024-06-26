const { StatusCodes } = require("http-status-codes");

// Models
const CartItem = require("../model/cart_items");
const Cart = require("../model/cart.js");
const Product = require("../model/product.js");
// Errors
const NotFoundError = require("../errors/notFound.js");
const BadRequestError = require("../errors/badRequest.js");

// Utils
const updateSubtotal = require("../utility/updateSubtotal.js");
const findCart = require("../utility/getCart");

const { col } = require("sequelize");

const addCartItem = async (req, res, next) => {
  const { productId: ProductId, quantity } = req.body;

  const product = await Product.findByPk(ProductId, {
    attributes: ["price", "quantity", "SellerId"],
  });

  if (!product) throw new NotFoundError("product", ProductId);

  if (product.getDataValue("SellerId") === req.customer.id)
    throw new BadRequestError("Can not add product to its Owner cart");

  const { quantity: Productquantity } = product.dataValues;

  if (quantity > Productquantity)
    throw new BadRequestError(
      Productquantity
        ? `This seller has only ${Productquantity} of these available.`
        : `That product aren't available`
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

  const cart = await findCart(req.customer.id);

  res.status(StatusCodes.OK).json({ data: { cart } });
};

const deleteCartItem = async (req, res, next) => {
  const { productId: ProductId } = req.params;

  const {
    cart: { id: CartId },
    newSubtotal,
  } = await updateSubtotal(req.customer.id, ProductId, 0);

  await CartItem.destroy({ where: { CartId, ProductId } });

  res.status(StatusCodes.OK).json({ data: { subtotal: newSubtotal } });
};

module.exports = { addCartItem, updateCartItem, deleteCartItem };
