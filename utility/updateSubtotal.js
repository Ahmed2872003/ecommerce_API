const Cart = require("../model/cart.js");
const Product = require("../model/product.js");

// Errors
const NotFoundError = require("../errors/badRequest.js");
const BadRequestError = require("../errors/notFound.js");

const { col } = require("sequelize");

const updateSubtotal = async (CustomerId, productId, neededQuantity) => {
  const cart = await Cart.findOne({
    attributes: [
      "subtotal",
      "id",
      [col("Products.price"), "productPrice"],
      [col("Products.CartItem.quantity"), "oldQuantity"],
      [col("Products.quantity"), "ProductQuantity"],
    ],
    where: { CustomerId, "$Products.id$": productId },
    include: {
      model: Product,
      attributes: [],
      through: { attributes: [] },
      required: true,
    },
  });

  if (!cart) throw new NotFoundError(`No product found with id ${productId}`);

  if (neededQuantity > cart.ProductQuantity)
    throw new BadRequestError(
      `This seller has only ${cart.ProductQuantity} of these available.`
    );

  const { subtotal, id, productPrice, oldQuantity } = cart.dataValues;

  const newSubtotal = subtotal - productPrice * (oldQuantity - +neededQuantity);

  await cart.update({
    subtotal: newSubtotal,
  });

  return { cart: cart.dataValues, newSubtotal };
};

module.exports = updateSubtotal;
