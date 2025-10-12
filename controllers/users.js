const bcrypt = require("bcryptjs");
const user = require("../models/user");
const STATUS = require("../utils/errors");
const SECRET = require("../utils/config");
const jwt = require('jsonwebtoken');

module.exports.createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    // Pre-check to give a fast 409 if email already exists
    const existing = await user.findOne({ email });
    if (existing) {
      return res
        .status(STATUS.EXISTING_EMAIL_ERROR)
        .send({ message: 'A user with this email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await user.create({ name, avatar, email, password: hash });
    const userObject = newUser.toObject();
    delete userObject.password;
    return res.status(STATUS.CREATED).send(userObject);
  } catch (err) {
    console.error(err);
    // If a race occurred and Mongo reports duplicate key, return 409
    if (err && err.code === 11000) {
      return res
        .status(STATUS.EXISTING_EMAIL_ERROR)
        .send({ message: 'A user with this email already exists' });
    }
    if (err && err.name === 'ValidationError') {
      return res.status(STATUS.BAD_REQUEST).send({ message: err.message });
    }
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: 'An error has occurred on the server' });
  }
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;
  user
    .findById(userId)
    .orFail(new Error("User not found"))
    .then((newUser) => res.status(STATUS.OK).send(newUser))
    .catch((err) => {
      console.error(err);
      if (err && err.name === "CastError") {
        return res
          .status(STATUS.BAD_REQUEST)
          .send({ message: "Invalid user id" });
      }
      if (
        err &&
        (err.message === "User not found" ||
          err.name === "DocumentNotFoundError")
      ) {
        return res.status(STATUS.NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return user
    .findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, SECRET.JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      res.status(STATUS.BAD_REQUEST).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  return user
    .findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      {
        new: true,
        runValidators: true,
      }
    )
    .orFail(new Error("User not found"))
    .then((user) => {
      res.send(user);
    }).catch((err => {
       if (
        err &&
        (err.message === "User not found" ||
          err.name === "DocumentNotFoundError")
      ) {
        return res.status(STATUS.NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    }));
};
