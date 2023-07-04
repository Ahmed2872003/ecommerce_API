// Models
const Cart = require("../model/cart.js");
const CartItem = require("../model/cart_items.js");
const Product = require("../model/product.js");

// Errors
const NotFoundError = require("../errors/notFound.js");
const BadRequestError = require("../errors/badRequest.js");

const { StatusCodes } = require("http-status-codes");

const { col, literal } = require("sequelize");

const addToCart = async (req, res, next) => {
  const { productId: ProductId, quantity } = req.body;

  const product = await Product.findByPk(ProductId, {
    attributes: ["price", "quantity"],
  });

  if (!product) throw new NotFoundError("product", ProductId);

  if (quantity > product.getDataValue("quantity"))
    throw new BadRequestError(`This seller has only ${product.getDataValue("quantity")} of these available.`);


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

  await cart.update({
    subtotal:
      cart.getDataValue("subtotal") + product.getDataValue("price") * +quantity,
  });

  res.sendStatus(StatusCodes.OK);
};

const updateCart = async (req, res, next) => {
  const { productId, quantity: neededQuantity } = req.body;

  if (!productId || !neededQuantity)
    throw new BadRequestError("Must provide both productId and quantity");

  const cart = await Cart.findOne({
    raw: true,
    attributes: [
      "subtotal",
      "id",
      [col("Products.price"), "productPrice"],
      [col("Products.CartItem.quantity"), "oldQuantity"],
      [col("Products.quantity"), "ProductQuantity"],
    ],
    where: { CustomerId: req.customerId, "$Products.id$": productId },
    include: {
      model: Product,
      attributes: [],
      through: { attributes: [] },
      required: true,
    },
  });

  if (!cart) throw new NotFoundError(`No product found with id ${productId}`);
  
  if (neededQuantity > cart.ProductQuantity)
    throw new BadRequestError(`This seller has only ${cart.ProductQuantity} of these available.`);

  

  const { subtotal, id, productPrice, oldQuantity } = cart;

  const newSubtotal = subtotal - productPrice * (oldQuantity - +neededQuantity);

  await Cart.update(
    {
      subtotal: newSubtotal,
    },
    { where: { id } }
  );

  req.cart = { id, subtotal: newSubtotal };

  next();
};

const updateCartItem = async (req, res, next) => {
  const { productId: ProductId, quantity } = req.body;

  const { id, subtotal } = req.cart;

  await CartItem.update({ quantity }, { where: { ProductId, CartId: id } });

  res.status(StatusCodes.OK).json({ data: { subtotal } });
};

const getCart = async(req, res, next) =>{
  let cart = await Cart.findOne({

    where: { CustomerId: req.customerId },
    
    attributes: ["subtotal"],
    include:{
      model: Product,
      required: true,
      attributes: [ "id", "name", "price",  [literal("`Products->CartItem`.`quantity`"), "quantity"]],
      through:{model: CartItem , attributes: []}
    }, 

  });
// [literal("products->CartItem.quantity"), "quantity"]
  if(!cart)
    cart = { subtotal: 0, Products: [] };

  res.status(StatusCodes.OK).json({ data: { cart } });
}


module.exports = { addToCart, updateCart, updateCartItem, getCart };
