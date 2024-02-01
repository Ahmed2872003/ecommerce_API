const port = process.env.PORT || 5000;

// Modules(3rd party)
require("express-async-errors");
require("dotenv").config();

const http = require("http");
let server = http.createServer();

const express = require("express");
const app = express(server);
const multer = require("multer");
const cookieParser = require("cookie-parser");

// db connection
const sequelize = require("./DB/connect");

app.set("trust proxy", 1);
// Security packages
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
// ErrorHandlers
const errorHandler = require("./middleware/errorHandler.js");

const notFound = require("./middleware/notFound.js");

// routers
const productRouter = require("./routes/product.js");
const customerRouter = require("./routes/customer.js");
const authRouter = require("./routes/auth.js");
const reviewRouter = require("./routes/review.js");
const cartRouter = require("./routes/cart.js");
const orderRouter = require("./routes/order.js");
const emailRouter = require("./routes/email.js");
const stripeRouter = require("./routes/stripe.js");
// authorization
const auth = require("./middleware/authorization.js");

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
  })
);
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(xss());

app.use("/product", productRouter);
app.use("/auth", multer().none(), authRouter);
app.use("/review", reviewRouter);
app.use("/email", multer().none(), emailRouter);
app.use("/customer", auth, customerRouter);
app.use("/cart", auth, cartRouter);
app.use("/order", auth, orderRouter);
app.use("/stripe", stripeRouter);

app.use(notFound);
app.use(errorHandler);

// Listen for process termination signals
process.on("SIGINT", async () => {
  server.close(() => {
    process.exit(0);
  });
});

server.on("close", () => sequelize.close());

(async () => {
  try {
    await sequelize.authenticate();

    app.listen(port, () => console.log(`API is listening on port ${port}`));
    // require("./addProducts.js");
  } catch (err) {
    console.log(err.message);
    server.close();
  }
})();
