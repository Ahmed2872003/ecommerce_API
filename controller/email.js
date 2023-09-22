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

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY_EMAILCONF);
    const customer = await Customer.update(
      { confirmed: true },
      { where: { email: payload.email } }
    );
    res
      .status(StatusCodes.OK)
      .send("<h1>Email verfied successfully. Try to login</h1>");
  } catch (err) {
    res
      .status(StatusCodes.GONE)
      .send("<h1>This link is expired. Try to resent it</h1>");
  }
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

  const redirectLink = `${process.env.BASE_CLIENT_URL}/reset/password/${token}`;

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

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY_PASSRESET);
    await Customer.update({ password }, { where: { email } });
    res
      .status(StatusCodes.OK)
      .json({ msg: "Password has updated successfully" });
  } catch (err) {
    res
      .status(StatusCodes.GONE)
      .json({ msg: "Link is expired. try to resend it" });
  }
};

module.exports = { sendEmailConf, confEmail, sendPassReset, resetPass };
