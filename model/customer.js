const { DataTypes, ValidationError } = require("sequelize");

const sequelize = require("../DB/connect.js");

const { StatusCodes } = require("http-status-codes");
const { contentSecurityPolicy } = require("helmet");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Customer = sequelize.define(
  "Customer",
  {
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
              "password must contain\n- at least one:\n*Capital letter.\n*Small letter.\n*Number.\n*Special character.\n- From 8 to 32 character."
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
      validate: {
        len: [5, 30],
      },
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
    seller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { indexes: [{ unique: true, fields: ["email"] }] }
);

// hash password
Customer.hashPassIfChanged = async (customer) => {
  if (customer.changed("password")) {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(customer.get("password"), salt);
    customer.set("password", hashedPass);
  }
};

Customer.beforeCreate(async (customer, options) => {
  await Customer.hashPassIfChanged(customer);
  options.validate = false;
});

Customer.beforeUpdate(async (customer, options) => {
  await Customer.hashPassIfChanged(customer);
  options.validate = false;
});

Customer.createJWT = (customer) =>
  jwt.sign(
    {
      id: customer.getDataValue("id"),
      seller: customer.getDataValue("seller"),
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

Customer.sync();

module.exports = Customer;
