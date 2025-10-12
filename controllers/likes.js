const ClothingItem = require("../models/clothingItem");
const STATUS = require("../utils/errors");
const mongoose = require("mongoose");
module.exports.likeItem = (req, res) => {
  const {itemId} = req.params;
   if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(400)
      .send({ message: "Invalid item ID format" });
    }
  ClothingItem.findByIdAndUpdate(
    itemId,
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
};

module.exports.dislikeItem = (req, res) => {
  const {itemId} = req.params;

if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(400)
      .send({ message: "Invalid item ID format" });
    }

  ClothingItem.findByIdAndUpdate(
    itemId,
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
};
