// Models
const Customer = require("../model/customer.js");

// Modules
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    throw new CustomApiError(
      "Must provide both email and password",
      StatusCodes.BAD_REQUEST
    );
  let customer = await Customer.findOne({ where: { email } });

  if (!customer)
    throw new CustomApiError(
      "This email doesn't exist",
      StatusCodes.UNAUTHORIZED
    );

  if (await bcrypt.compare(password, customer.password)) {
    if (customer.getDataValue("confirmed")) {
      const token = Customer.createJWT(customer);

      customer = customer.toJSON();

      delete customer.password;

      res.json({ data: { token, customer } });
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Email is not confirmed" });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Wrong password" });
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("token").clearCookie("user").sendStatus(StatusCodes.OK);
};

const resetPass = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) throw new BadRequest("Provide a password");

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_KEY_PASSRESET);
  } catch (err) {
    res
      .status(StatusCodes.GONE)
      .json({ msg: "Link is expired. try to resend it" });
  }
  const customer = await Customer.findOne({ where: { email: payload.email } });

  await customer.update({ password });

  res
    .status(StatusCodes.OK)
    .json({ data: { msg: "Password has been updated successfully" } });
};

const confEmail = async (req, res, next) => {
  const { token } = req.params;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_KEY_EMAILCONF);
  } catch (err) {
    res
      .status(StatusCodes.GONE)
      .send("<h1>This link is expired. Try to resent it</h1>");
  }

  const customer = await Customer.update(
    { confirmed: true },
    { where: { email: payload.email } }
  );
  res.redirect(process.env.BASE_CLIENT_URL + "/auth/login");
};

module.exports = { signup, login, logout, resetPass, confEmail };
