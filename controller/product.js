const { Op, col } = require("sequelize");

// Models
const Category = require("../model/category.js");
const Product = require("../model/product.js");
const CartItem = require("../model/cart_items.js");
const Cart = require("../model/cart.js");

const { StatusCodes } = require("http-status-codes");

// Errors
const notFound = require("../errors/notFound.js");

// Utility
const userToSeqFilter = require("../utility/filter.js");
const updateSubtotal = require("../utility/updateSubtotal.js");

const getAllProducts = async (req, res, next) => {
  // Converting user filter to sequelize filter
  const filters = userToSeqFilter(req.query);

  const { page = 1, limit = 0 } = req.query;
  const offset = (+page - 1) * +limit;

  const products = await Product.findAll({
    raw: true,
    attributes: {
      exclude: ["description", "brand", "quantity", "CategoryId", "SellerId"],
      include: [[col("Category.name"), "category"]],
    },
    include: {
      model: Category,
      attributes: [],
      required: true,
    },
    where: {
      [Op.and]: filters,
    },
    order: [
      ["rating", "DESC"],
      ["createdAt", "DESC"],
      ["id", "ASC"],
    ],
    limit: +limit || undefined,
    offset,
  });

  res.status(200).json({ data: products, length: products.length });
};

const getProduct = async (req, res, next) => {
  const { id } = req.params;

  const result = await Product.findOne({
    raw: true,
    attributes: {
      exclude: ["CategoryId"],
      include: [[col("Category.name"), "category"]],
    },
    where: {
      id: { [Op.eq]: id },
    },
    include: {
      model: Category,
      attributes: [],
      required: true,
    },
  });

  if (!result) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no product with ID: ${id}` });
    return;
  }

  res.status(200).json({ data: result });
};

const createProduct = async (req, res, next) => {
  req.body.SellerId = req.customer.id;
  await Product.create(req.body);

  res.sendStatus(StatusCodes.CREATED);
};

const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity: newQuantity, price } = req.body;

  const product = await Product.findByPk(productId);
  if (!product) throw new notFound("product", productId);
  const { quantity: oldQuantity, price: Oldprice } = product.dataValues;

  const cartItems = await CartItem.findAll({
    where: { ProductId: productId },
    include: { model: Cart },
  });

  if (newQuantity !== undefined || price !== undefined) {
    for (const cartItem of cartItems) {
      const cart = cartItem["Cart"];
      const { subtotal } = cart.dataValues;
      const requestedQ = cartItem.getDataValue("quantity");

      // When the seller need to update quantity and the new quantity is less than the requested quantity by the customer delete the product from his cart else update subtotal according the new price
      if (newQuantity !== undefined && requestedQ > newQuantity) {
        await cartItem.destroy();
        await cart.update({ subtotal: subtotal - requestedQ * Oldprice });
      } else if (price !== undefined)
        await cart.update({
          subtotal: subtotal - requestedQ * (Oldprice - price),
        });
    }
  }

  await product.update(req.body);

  res.sendStatus(StatusCodes.OK);
};

const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findByPk(productId);
  if (!product) throw new notFound("product", productId);
  const { price } = product.dataValues;

  const cartItems = await CartItem.findAll({
    where: { ProductId: productId },
    include: { model: Cart },
  });

  // Delete the product from all carts that have it
  for (const cartItem of cartItems) {
    const cart = cartItem["Cart"];
    const { subtotal } = cart.dataValues;
    const { quantity } = cartItem.dataValues;

    await cart.update({ subtotal: subtotal - quantity * price });
  }

  await product.destroy();

  res.sendStatus(StatusCodes.OK);
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
