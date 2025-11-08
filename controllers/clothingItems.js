const ClothingItem = require("../models/clothingItem");
const STATUS = require("../utils/errors");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/notFound-err");

// GET /clothing-items (or similar route)
module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS.OK).send(items))
    .catch((err) => {
      // return res
      //   .status(STATUS.INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
      next(err);
    });
};

// POST /clothing-items
module.exports.createClothingItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => res.status(STATUS.CREATED).send(item))
    .catch((err) => {
      if (err && err.name === "ValidationError") {
        return next(new BadRequestError("the data is invalid"));
      }

      return next(err);
    });
};

// DELETE /items/:id
module.exports.deleteClothingItemById = (req, res, next) => {
  const { itemId } = req.params;

  return ClothingItem.findById(itemId)
    .orFail(new Error("item not found"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("Not authorized to delete item");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err && err.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      if (
        err &&
        (err.message === "item not found" ||
          err.name === "DocumentNotFoundError")
      ) {
        return next(new NotFoundError("item not found"));
      }

      return next(err);
    });
};
