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

  sendAuthEmail({ redirectLink, authType, target }) {
    let body;
    let subject;
    if (authType === "emailConfirmation") {
      body = `<p>Press the link below to confirm your email.</p>
      <span>Link: </span><a href=${redirectLink}>${redirectLink}</a>`;
      subject = "Email confirmation";
    } else if (authType === "passReset") {
      body = `<p>Press the button below to reset your password.</p>
      <a href=${redirectLink} style="text-decoration:none;background-color:#f7ca00;padding:15px;color:black;border-radius:5px;font-family: Verdana, Geneva, Tahoma, sans-serif;
      display:inline-block;">Reset</a>`;
      subject = "Reset password";
    }

    const mailOptions = {
      from: this.user,
      to: target,
      subject,
      html: body,
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
