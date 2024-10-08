// Models
const Customer = require("../model/customer.js");

// Errors
const CustomAPIError = require("../errors/custom.js");

const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

const { fn, col } = require("sequelize");

const updateCustomer = async (req, res, next) => {
  const { password, newPass } = req.body;

  if (!password)
    throw new CustomAPIError("Must provide password", StatusCodes.BAD_REQUEST);

  const customer = await Customer.findByPk(req.customer.id);

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

const getCustomer = async (req, res, next) => {
  let { customerId: customerID } = req.query;

  if (!customerID) customerID = req.customer.id;

  let customer = await Customer.findByPk(customerID, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (!customer)
    throw new CustomAPIError(
      `No customer found with that id: ${customerID}`,
      StatusCodes.NOT_FOUND
    );

  res.status(200).json({
    data: {
      customer: {
        ...customer.dataValues,
        full_name: customer.get("full_name"),
      },
    },
  });
};

module.exports = { updateCustomer, getCustomer };
