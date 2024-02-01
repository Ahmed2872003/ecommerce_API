// Modules
const { StatusCodes } = require("http-status-codes");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// utils
const cld = require("../utility/cloudinary");

// Utils
const getCart = require("../utility/getCart");

const createCheckoutSession = async (req, res, next) => {
  const { products } = req.body;

  const { buyNow } = req.query;

  const cart = await getCart(req.customer.id);

  const line_items = products.map((product) => {
    product.image = cld.url(product.image, { format: "jpg" });
    return {
      price_data: {
        currency: "usd",

        unit_amount: product.price * 100,

        product_data: {
          name: product.name,
          images: [product.image],
          metadata: {
            id: product.id,
          },
        },
      },
      quantity: product.neededQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    line_items,
    mode: "payment",
    customerId: req.customer.id,
    cart: !Number.isNaN(+buyNow) && +buyNow ? cart : null,
    success_url: process.env.BASE_CLIENT_URL,
  });

  res.status(StatusCodes.OK).json({ data: { url: session.url } });
};

const listenToStripeEvents = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  console.log(req.body);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    console.log(err.message);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      console.log(event.data.object);
      break;
  }

  res.sendStatus(StatusCodes.OK);
};
module.exports = { createCheckoutSession, listenToStripeEvents };
