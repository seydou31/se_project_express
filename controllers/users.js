const user = require("../models/user");
const STATUS = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  user
    .find({})
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(STATUS.OK).send({ message: "No users found" });
      }
      return res.status(STATUS.OK).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  user
    .create({ name, avatar })
    .then((newUser) => res.status(STATUS.CREATED).send(newUser))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(STATUS.BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.getSpecificUser = (req, res) => {
  const { userId } = req.params;
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
        .send({ message: err.message });
    });
};
