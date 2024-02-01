// Models
const orderProduct = require("../model/order_products.js");
const Order = require("../model/order.js");
const CartItems = require("../model/cart_items.js");
const Product = require("../model/product.js");
const Cart = require("../model/cart.js");

const { literal, col } = require("sequelize");

const createOrderProducts = async (req, res, next) => {
  const cartItems = await CartItems.findAll({
    raw: true,
    attributes: {
      include: [
        literal(`${req.order.getDataValue("id")} AS OrderId`),
        [col("Product.price"), "pricePerItem"],
      ],
      exclude: ["CartId"],
    },
    where: { CartId: req.cartId },
    include: {
      model: Product,
      attributes: [],
    },
  });

  await orderProduct.bulkCreate(cartItems);

  next();
};

const getOrderProducts = async (req, res, next) => {
  const orderProdcuts = await Order.findAll({
    attributes: { exclude: ["CustomerId"] },
    where: { CustomerId: req.customer.id },
    include: {
      model: Product,
      attributes: [
        "id",
        "name",
        "price",
        "image",
        "currency",
        [literal("`Poroducts->orderPrduct`.`quantity`"), "quantity"],
      ],
      through: { model: orderProduct, attributes: [] },
    },
  });
  res.status(200).json({ data: { orders: orderProdcuts } });
};

module.exports = { createOrderProducts, getOrderProducts };
