const express = require("express");

const router = express.Router();

const {
  createCheckoutSession,
  listenToStripeEvents,
} = require("../controller/stripe");

const auth = require("../middleware/authorization");

router.post("/create-checkout-session", auth, createCheckoutSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  listenToStripeEvents
);

module.exports = router;
