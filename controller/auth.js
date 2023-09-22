// Models
const Customer = require("../model/customer.js");

// Modules
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
// Errors
const BadRequest = require("../errors/badRequest.js");
const CustomApiError = require("../errors/custom.js");

const signup = async (req, res, next) => {
  const customer = await Customer.create(req.body);

  res.sendStatus(StatusCodes.CREATED);
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

  if (await bcrypt.compare(password, customer.password)) {
    if (customer.getDataValue("confirmed")) {
      const token = Customer.createJWT(customer);
      res
        .status(StatusCodes.OK)
        .json({ data: { token, name: customer.get("full_name") } });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Email not confirmed" });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Wrong password" });
  }
};

// const resetPass = async (req, res, next) => {
//   const { password, email } = req.body;

//   const { token } = req.params;

//   if (!password || !email)
//     throw new BadRequest("Must provide both email and new password");

//   const customer = await Customer.findOne({ email });

//   if (!customer)
//     throw new CustomApiError("This email doesn't exist", StatusCodes.NOT_FOUND);

//   await customer.update({ password });
// };

module.exports = { signup, login };
