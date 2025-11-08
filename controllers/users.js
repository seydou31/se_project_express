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

      throw new ConflictError("A user with this email already exists");
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await user.create({ name, avatar, email, password: hash });
    const userObject = newUser.toObject();
    delete userObject.password;
    return res.status(STATUS.CREATED).send(userObject);
  } catch (err) {
    console.error(err);

    if (err && err.name === "ValidationError") {
      return next(new BadRequestError("invalid data"));
    }

    return next(err);
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

        return next(new BadRequestError("Invalid user id"));
      }
      if (
        err &&
        (err.message === "User not found" ||
          err.name === "DocumentNotFoundError")
      ) {
        return next(new NotFoundError("user not found"));
      }

      return next(err);
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
      if (err && err.name === "ValidationError") {
        return next(new BadRequestError("invalid data"));
      }
     return  next(err);
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
        return next(new BadRequestError(err.message));
      }
       if (err.message === "User not found") {
        return next(new NotFoundError(err.message));
      }
        return next(err);
      
    });
};
