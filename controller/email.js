// Errors
const BadRequestError = require("../errors/badRequest.js");
const CustomError = require("../errors/custom.js");
// Modules
const jwt = require("jsonwebtoken");

// nodemailer
const Mail = require("../utility/nodemailer.js");

// Models
const Customer = require("../model/customer.js");

// Utils
const mail = new Mail(process.env.BASE_EMAIL, process.env.BASE_EMAIL_PASS);
const { StatusCodes } = require("http-status-codes");

const sendEmailConf = async (req, res, next) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError("Provide an email");

  const customer = await Customer.findOne({ where: { email } });

  if (!customer)
    throw new CustomError("This email doesn't exist.", StatusCodes.NOT_FOUND);

  if (customer.getDataValue("confirmed")) {
    res
      .status(StatusCodes.CONFLICT)
      .json({ msg: "This email has been already confirmed." });
    return;
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY_EMAILCONF, {
    expiresIn: "10m",
  });
  const redirectLink = `${process.env.BASE_SERVER_URL}/email/confirmation/${token}`;

  await mail.sendAuthEmail({
    redirectLink,
    authType: "emailConfirmation",
    target: email,
  });

  res.status(StatusCodes.OK).json({ msg: "Email sent successfully." });
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

const sendPassReset = async (req, res, next) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError("Provide an email");

  const customer = await Customer.findOne({ where: { email } });

  if (!customer)
    throw new CustomError("This email doesn't exist.", StatusCodes.NOT_FOUND);

  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY_PASSRESET, {
    expiresIn: "10m",
  });

  const redirectLink = `${process.env.BASE_CLIENT_URL}/auth/reset/password/${token}`;

  await mail.sendAuthEmail({
    redirectLink,
    authType: "passReset",
    target: email,
  });

  res.status(StatusCodes.OK).json({ msg: "Email sent successfully." });
};

const resetPass = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) throw new BadRequestError("Provide a password");

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
    .json({ msg: "Password has been updated successfully" });
};

module.exports = { sendEmailConf, confEmail, sendPassReset, resetPass };
