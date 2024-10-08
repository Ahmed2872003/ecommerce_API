// Models
const orderProduct = require("../model/order_products.js");
const Order = require("../model/order.js");
const CartItems = require("../model/cart_items.js");
const Product = require("../model/product.js");
const Cart = require("../model/cart.js");
const Address = require("../model/address.js");

const { literal, col } = require("sequelize");
const Customer = require("../model/customer.js");

const createOrderProducts = async (req) => {
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
};

const getCustomerOrderProducts = async (req, res, next) => {
  const orderProdcuts = await Order.findAll({
    attributes: { exclude: ["CustomerId", "AddressId"] },
    where: { CustomerId: req.customer.id },
    include: [
      {
        model: Address,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },

      {
        model: Product,
        attributes: [
          "id",
          "name",
          "price",
          "image",
          "currency",
          [literal("`Products->orderProduct`.`quantity`"), "quantity"],
        ],
        through: { model: orderProduct, attributes: [] },
        required: false,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ data: { orders: orderProdcuts } });
};

const getIncomingOrderProducts = async (req, res, next) => {
  const incomingorderProdcuts = await Order.findAll({
    attributes: { exclude: ["CustomerId", "AddressId"] },
    include: [
      {
        model: Address,
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },

      {
        model: Product,
        where: { SellerId: req.customer.id },
        attributes: [
          "id",
          "name",
          "price",
          "image",
          "currency",
          [literal("`Products->orderProduct`.`quantity`"), "quantity"],
        ],
        through: { model: orderProduct, attributes: [] },
      },
      {
        model: Customer,
        attributes: ["id"],
        required: true,
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ data: { orders: incomingorderProdcuts } });
};

module.exports = {
  createOrderProducts,
  getCustomerOrderProducts,
  getIncomingOrderProducts,
};
