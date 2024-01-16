const { Op, col, fn, literal } = require("sequelize");

// Models
const Category = require("../model/category.js");
const Product = require("../model/product.js");
const CartItem = require("../model/cart_items.js");
const Cart = require("../model/cart.js");
const Review = require("../model/review.js");
const Customer = require("../model/customer.js");

const { StatusCodes } = require("http-status-codes");

// Errors
const notFound = require("../errors/notFound.js");
const BadRequest = require("../errors/badRequest.js");

// Utility
const userToSeqFilter = require("../utility/filter.js");
const updateSubtotal = require("../utility/updateSubtotal.js");
const cloudinary = require("../utility/cloudinary.js");

const getAllProducts = async (req, res, next) => {
  // Converting user filter to sequelize filter
  const filters = userToSeqFilter(req.query);

  const { page = 1, limit = 0 } = req.query;
  const offset = (+page - 1) * +limit;

  const products = await Product.findAll({
    raw: true,
    attributes: {
      exclude: [
        "description",
        "brand",
        "quantity",
        "CategoryId",
        "SellerId",
        "images",
      ],
      include: [
        [col("Category.name"), "category"],
        [fn("COUNT", col("Reviews.id")), "reviewsCount"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      { model: Category, attributes: [], required: true },
    ],
    group: ["id"],
    subQuery: false,

    where: {
      [Op.and]: filters,
    },
    order: [
      ["rating", "DESC"],
      ["createdAt", "DESC"],
      ["id", "ASC"],
    ],

    subQuery: false,

    limit: +limit || undefined,
    offset,
  });

  res.status(200).json({ data: { products, length: products.length } });
};

const getProduct = async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    attributes: {
      exclude: ["CategoryId", "SellerId"],
      include: [
        [col("Category.name"), "category"],
        [fn("COUNT", col("Reviews.id")), "reviewsCount"],
      ],
    },
    where: {
      id: { [Op.eq]: id },
    },
    include: [
      {
        model: Category,
        attributes: [],
        required: true,
      },
      {
        model: Review,
        attributes: [],
      },
      {
        model: Customer,
        as: "Seller",
        attributes: ["id", "first_name", "email"],
      },
    ],
    subQuery: false,
  });

  if (!product) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no product with ID: ${id}` });
    return;
  }

  res.status(200).json({
    data: {
      product,
    },
  });
};

const createProduct = async (req, res, next) => {
  req.body.SellerId = req.customer.id;

  if (
    !(
      req.files["image"] &&
      req.files["images"] &&
      req.files["images"].length === 5
    )
  )
    throw new BadRequest(
      "Should provide 1 image for product cover and 5 for product images"
    );
  let { image, images } = req.files;
  [image] = image;

  const product = await Product.create({
    ...req.body,
    image: "",
    images: [],
  });

  const coverImgPubId = await cloudinary.upload_stream(image, "products");

  const imagesPubId = await cloudinary.upload_bulk_stream(images, "products");

  await product.update({ image: coverImgPubId, images: imagesPubId });

  res.status(StatusCodes.CREATED).json({
    data: {
      product: { id: product.getDataValue("id"), image: coverImgPubId },
    },
  });
};

const updateProduct = async (req, res, next) => {
  const { productId } = req.params;

  const { quantity: newQuantity, price } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) throw new notFound("product", productId);

  if (req.files["image"]) {
    const [image] = req.files["image"];
    await cloudinary.upload_stream(
      image,
      "products",
      product.getDataValue("image")
    );
  }
  if (req.files["images"]) {
    const images = req.files["images"];

    if (images.length !== 5)
      throw new BadRequest("Must provide 5 for product images");

    await cloudinary.upload_bulk_stream(
      images,
      "products",
      product.get("images")
    );
  }

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

  const imagesPubId = product.get("images");

  imagesPubId.push(product.getDataValue("image"));

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

  await cloudinary.upload_bulk_destroy(imagesPubId);

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
