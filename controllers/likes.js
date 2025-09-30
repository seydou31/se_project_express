const ClothingItem = require("../models/clothingItem");
const STATUS = require("../utils/errors");

module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(STATUS.NOT_FOUND)
          .send({ message: "ClothingItem not found" });
      }
      return res.status(STATUS.OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err && err.name === "CastError") {
        return res
          .status(STATUS.BAD_REQUEST)
          .send({ message: "Invalid item id" });
      }
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });

module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(STATUS.NOT_FOUND)
          .send({ message: "ClothingItem not found" });
      }
      return res.status(STATUS.OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err && err.name === "CastError") {
        return res
          .status(STATUS.BAD_REQUEST)
          .send({ message: "Invalid item id" });
      }
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
