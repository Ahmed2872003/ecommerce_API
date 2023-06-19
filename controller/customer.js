const Customer = require("../model/customer.js");

const { StatusCodes } = require("http-status-codes");

const CustomAPIError = require("../errors/customError.js");

const bcrypt = require("bcrypt");

const updateCustomer = async (req, res, next) => {
  const { password, newPass } = req.body;

  if (!password)
    throw new CustomAPIError("Must provide password", StatusCodes.BAD_REQUEST);

  const customer = await Customer.findByPk(req.customerId);

  if (!(await bcrypt.compare(password, customer.get("password"))))
    throw new CustomAPIError("Incorrect password", StatusCodes.BAD_REQUEST);

  delete req.body.password;

  if (newPass) {
    await customer.update({ ...req.body, password: newPass });

    res.sendStatus(StatusCodes.OK);

    return;
  }
  await customer.update(req.body);

  res.sendStatus(StatusCodes.OK);
};

module.exports = { updateCustomer };
