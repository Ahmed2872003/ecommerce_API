// Errors
const BadRequestError = require("../errors/badRequest.js");
const CustomError = require("../errors/custom.js");

// nodemailer
const Mail = require("../utility/nodemailer.js");

// Models
const Customer = require("../model/customer.js");

const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const sendEmailConf = async (req, res, next) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError("Provide an email");

  const customer = await Customer.findOne({ where: { email } });

  if (!customer)
    throw new CustomError("This email doesn't exist.", StatusCodes.NOT_FOUND);

  if (customer.getDataValue("confirmed")) {
    res
      .status(StatusCodes.OK)
      .json({ msg: "This email has been already confirmed." });
    return;
  }

  const mail = new Mail(process.env.BASE_EMAIL, process.env.BASE_EMAIL_PASS);

  await mail.sendEmailVerfiction(email);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Email confirmation sent successfully." });
};

const confEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const customer = await Customer.update(
      { confirmed: true },
      { where: { email: payload.email } }
    );
    res
      .status(StatusCodes.OK)
      .send("<h1>Email verfied successfully. Try to login</h1>");
  } catch (err) {
    res
      .status(StatusCodes.OK)
      .send("<h1>This link is expired. Try to resent it</h1>");
  }
};

module.exports = { sendEmailConf, confEmail };
