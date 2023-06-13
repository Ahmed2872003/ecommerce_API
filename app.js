require("express-async-errors");

require("dotenv").config();

const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

// db connection
const { db } = require("./DB/connect");

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

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors({ origin: "http://localhost:5000" }));
app.use(xss());

app.use("/product", productRouter);

app.use(notFound);
app.use(errorHandler);

(async () => {
  try {
    await db.connect();
    app.listen(port, () => console.log(`API is litening on port ${port}`));
  } catch (err) {
    console.log(err.message);
  }
})();
