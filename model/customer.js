const { DataTypes, ValidationError } = require("sequelize");

const sequelize = require("../DB/connect.js");

const { StatusCodes } = require("http-status-codes");
const { contentSecurityPolicy } = require("helmet");
const bcrypt = require("bcrypt");

const Customer = sequelize.define("Customer", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 15],
    },
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 15],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Provide a valid email",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 32],
      isValidFormat(pass) {
        const regExp =
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if (pass.match(regExp) === null)
          throw new Error(
            "password must contain at least one: *Capital letter\n*Small letter\n*Number\n*Special character"
          );
      },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isPhoneNumber(value) {
        if (value.match(/^01[0-2]{1}[0-9]{8}$/) === null)
          throw new Error("Provide a valide phone number.");
      },
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 15],
    },
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: null,
    validate: {
      len: [3, 15],
    },
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 15],
    },
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isZipCode(value) {
        if (value.match(/^[0-9]{5}$/) === null)
          throw new Error("Provide a valid zip_code ex. 11111");
      },
    },
  },
});

Customer.sync();

// hash password
Customer.beforeCreate(async (customer, options) => {
  const salt = await bcrypt.genSalt();
  customer.password = await bcrypt.hash(customer.password, salt);
});

module.exports = Customer;
