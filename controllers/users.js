const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const STATUS = require("../utils/errors");
const SECRET = require("../utils/config");
const ConflictError = require("../errors/conflictError-err");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/notFound-err");

module.exports.createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    // Pre-check to give a fast 409 if email already exists
    const existing = await user.findOne({ email });
    if (existing) {
      // return res
      //   .status(STATUS.EXISTING_EMAIL_ERROR)
      //   .send({ message: 'A user with this email already exists' });
      throw new ConflictError("A user with this email already exists");
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await user.create({ name, avatar, email, password: hash });
    const userObject = newUser.toObject();
    delete userObject.password;
    return res.status(STATUS.CREATED).send(userObject);
  } catch (err) {
    console.error(err);
    // If a race occurred and Mongo reports duplicate key, return 409
    // if (err && err.code === 11000) {
    //   return res
    //     .status(STATUS.EXISTING_EMAIL_ERROR)
    //     .send({ message: 'A user with this email already exists' });
    // }
    if (err && err.name === "ValidationError") {
      // return res.status(STATUS.BAD_REQUEST).send({ message: err.message });
      return next(new BadRequestError("invalid data"));
    }
    // return res
    //   .status(STATUS.INTERNAL_SERVER_ERROR)
    //   .send({ message: 'An error has occurred on the server' });
    next(err);
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  user
    .findById(userId)
    .orFail(new Error("User not found"))
    .then((newUser) => res.status(STATUS.OK).send(newUser))
    .catch((err) => {
      console.error(err);
      if (err && err.name === "CastError") {
        // return res
        //   .status(STATUS.BAD_REQUEST)
        //   .send({ message: "Invalid user id" });
        return next(new BadRequestError("Invalid user id"));
      }
      if (
        err &&
        (err.message === "User not found" ||
          err.name === "DocumentNotFoundError")
      ) {
        // return res.status(STATUS.NOT_FOUND).send({ message: "User not found" });
        return next(new NotFoundError("user not found"));
      }
      // return res
      //   .status(STATUS.INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

    if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return user
    .findUserByCredentials(email, password)
    .then((data) => {
      res.send({
        token: jwt.sign({ _id: data._id }, SECRET.JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      // res.status(STATUS.BAD_REQUEST).send({ message: err.message });
      if (err && err.name === "ValidationError") {
        return next(new BadRequestError("invalid data"));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
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
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        // res.status(STATUS.BAD_REQUEST).send({ message: err.message });
        return next(new BadRequestError(err.message));
      } else if (err.message === "User not found") {
        // res.status(STATUS.NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError(err.message));
      } else {
        // res.status(STATUS.INTERNAL_SERVER_ERROR).send({ message: err.message });
        next(err);
      }
    });
};
