const Cart = require("../model/cart.js");
const Product = require("../model/product.js");

// Errors
const NotFoundError = require("../errors/notFound.js");
const BadRequestError = require("../errors/badRequest.js");

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

  const { subtotal, productPrice, oldQuantity, ProductQuantity } =
    cart.dataValues;

  if (neededQuantity > ProductQuantity)
    throw new BadRequestError(
      ProductQuantity
        ? `This seller has only ${ProductQuantity} of these available.`
        : `That product aren't available`
    );

  const newSubtotal = subtotal - productPrice * (oldQuantity - +neededQuantity);

  await cart.update({
    subtotal: newSubtotal,
  });

  return { cart: cart.dataValues, newSubtotal };
};

module.exports = updateSubtotal;
