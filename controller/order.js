// Models
const Cart = require("../model/cart.js");
const Order = require("../model/order.js");
const Product = require("../model/product.js");
const CartItem = require("../model/cart_items.js");
const Address = require("../model/address.js");

const createOrder = async (req) => {
  const {
    amount: { subtotal, shipping_amount, total_amount },
    address,
    status,
    delivery_estimate: { minimum: minDelivery, maximum: maxDelivery },
  } = req.paymentDetails;

  const addressRow = await Address.create(address);

  const cart = await Cart.findOne({
    where: { CustomerId: req.customer.id },
    include: { model: Product, through: { model: CartItem } },
  });

  const order = await Order.create({
    CustomerId: req.customer.id,
    AddressId: addressRow.getDataValue("id"),
    subtotal,
    shipping_amount,
    total_amount,
    delivery_estimate: [minDelivery.value, maxDelivery.value],
    status,
  });

  req.order = order;
  req.cartId = cart.getDataValue("id");
};

module.exports = { createOrder };
