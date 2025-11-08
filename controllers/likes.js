
const ClothingItem = require("../models/clothingItem");
const STATUS = require("../utils/errors");
const NotFoundError = require("../errors/notFound-err")
const BadRequestError = require("../errors/bad-request-err")

module.exports.likeItem = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {

        throw new NotFoundError("ClothingItem not found")
      }
      return res.status(STATUS.OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err && err.name === "CastError") {

         return next(new BadRequestError("Invalid item id"))

      }

    return next(err)
    });
};

module.exports.dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {

         throw new NotFoundError("ClothingItem not found");
      }
      return res.status(STATUS.OK).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err && err.name === "CastError") {

        return next(new BadRequestError("Invalid item id"))
      }

     return next(err);
    });
};
