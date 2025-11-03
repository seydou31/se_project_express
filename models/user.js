const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const BadRequestError = require("../errors/bad-request-err");
const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Wrong email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

user.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((customer) => {
      if (!customer) {
         throw new BadRequestError("Incorrect password or email")
      }

      return bcrypt.compare(password, customer.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect password or email'));
          }

          return customer;
        });
    });
};

module.exports = mongoose.model("user", user);
