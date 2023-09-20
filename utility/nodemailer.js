const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

class mail {
  constructor(user, pass) {
    this.user = user;
    this.pass = pass;
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  sendEmailVerfiction(target) {
    const token = jwt.sign({ email: target }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1m",
    });
    const link = `http://localhost:5000/email/confirmation/${token}`;

    const mailOptions = {
      from: this.user,
      to: target,
      subject: "Email confirmation",
      html: `<p>Press the link below to confirm your email.</p>
      <span>Link: </span><a href=${link}>${link}</a>`,
    };
    return new Promise((res, rej) => {
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          rej(error);
        } else {
          res(info.response);
        }
      });
    });
  }
}

module.exports = mail;
