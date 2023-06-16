const Customer = require("../model/customer.js");
const customError = require("../errors/customError.js");
const { StatusCodes } = require("http-status-codes");
const createCustomer = async (req, res, next) => {
  await Customer.create(req.body);

  res.sendStatus(StatusCodes.CREATED);
};

module.exports = { createCustomer };
