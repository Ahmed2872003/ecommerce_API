const Customer = require("../model/customer.js");

const { StatusCodes } = require("http-status-codes");

const customAPIError = require("../errors/custom.js");

const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  const customer = await Customer.create(req.body);

  const token = Customer.createJWT(customer);

  res.status(StatusCodes.CREATED).json({ data: { token } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new customAPIError(
      "Must provide both email and password",
      StatusCodes.BAD_REQUEST
    );
  let customer = await Customer.findOne({ where: { email } });

  if (!customer)
    throw new customAPIError(
      "This email doesn't exist",
      StatusCodes.UNAUTHORIZED
    );

  customer = customer.dataValues;

  if (await bcrypt.compare(password, customer.password)) {
    const token = Customer.createJWT(customer);

    res.status(StatusCodes.OK).json({ data: { token } });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Wrong password" });
  }
};

module.exports = { signup, login };
