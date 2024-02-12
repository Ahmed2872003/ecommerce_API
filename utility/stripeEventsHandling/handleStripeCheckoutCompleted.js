const { createOrderProducts } = require("../../controller/orderProducts");
const { createOrder } = require("../../controller/order");

// Models
const Cart = require("../../model/cart");
const Order = require("../../model/order.js");
const Product = require("../../model/product.js");
const CartItem = require("../../model/cart_items.js");
const orderProducts = require("../../model/order_products");
const { fn, Sequelize, col } = require("sequelize");

// Modules
const { stripe } = require("../stripe");

async function handleStripeCheckoutCompleted(req, res, eventObjData) {
  const subtotal = eventObjData.amount_subtotal / 100;
  const shipping_amount = eventObjData.total_details.amount_shipping / 100;
  const total_amount = eventObjData.amount_total / 100;

  const { delivery_estimate } = await stripe.shippingRates.retrieve(
    eventObjData.shipping_cost.shipping_rate
  );
  req.customer = { id: eventObjData.metadata.customerId };

  req.paymentDetails = {
    amount: { subtotal, shipping_amount, total_amount },
    address: eventObjData.shipping_details.address,
    delivery_estimate,
    status: true,
  };

  await createOrder(req);
  await createOrderProducts(req);
  await Cart.destroy({ where: { CustomerId: req.customer.id } });
  await handleProductsQuantityAfterPlacingAnOrder(req);
}

async function handleProductsQuantityAfterPlacingAnOrder(req) {
  const productNewQuantities = await orderProducts.findAll({
    where: { OrderId: req.order.getDataValue("id") },

    attributes: [
      "ProductId",
      [
        Sequelize.literal("(`Product`.`quantity` - `orderProduct`.`quantity`)"),
        "newQuantity",
      ],
    ],

    include: {
      model: Product,
      attributes: [],
      as: "Product",
      required: true,
    },
  });

  const productsUpdatePromises = [];

  for (const productNewQuantity of productNewQuantities) {
    const { ProductId, newQuantity } = productNewQuantity.dataValues;
    productsUpdatePromises.push(
      Product.update({ quantity: newQuantity }, { where: { id: ProductId } })
    );
  }

  await Promise.all(productsUpdatePromises);
}

module.exports = { handleStripeCheckoutCompleted };
