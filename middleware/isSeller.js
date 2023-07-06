const CustomAPIError = require("../errors/custom.js");

const { StatusCodes } = require("http-status-codes");

const isSeller = async (req, res, next) => {
  const { seller } = req.customer;

  if (seller) next();
  else {
    throw new CustomAPIError(
      "You aren't allowed to do that action",
      StatusCodes.FORBIDDEN
    );
  }
};

module.exports = isSeller;
