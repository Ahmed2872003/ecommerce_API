const { col, literal } = require("sequelize");

// Models
const Cart = require("../model/cart.js");
const Product = require("../model/product.js");
const CartItem = require("../model/cart_items.js");

const getCart = async (CustomerId) =>
  await Cart.findOne({
    where: { CustomerId },

    attributes: ["id", "subtotal"],
    include: {
      model: Product,
      required: true,
      attributes: [
        "id",
        "name",
        "price",
        "image",
        "quantity",
        [literal("`Products->CartItem`.`quantity`"), "neededQuantity"],
      ],
      through: { model: CartItem, attributes: [] },
    },
  });

module.exports = getCart;
