const { createOrderProducts } = require("../../controller/orderProducts");
const { createOrder } = require("../../controller/order");

// Models
const Cart = require("../../model/cart");
const Order = require("../../model/order.js");
const Product = require("../../model/product.js");
const CartItem = require("../../model/cart_items.js");

async function handleStripeCheckoutCompleted(req, res, eventObjData) {
  const subtotal = eventObjData.amount_subtotal / 100;
  const shipping_amount = eventObjData.total_details.amount_shipping / 100;
  const total_amount = eventObjData.amount_total / 100;

  req.customer = { id: eventObjData.metadata.customerId };
  req.paymentDetails = {
    details: { subtotal, shipping_amount, total_amount },
    status: true,
  };

  await createOrder(req);
  await createOrderProducts(req);
  await Cart.destroy({ where: { CustomerId: req.customer.id } });
}

module.exports = { handleStripeCheckoutCompleted };
