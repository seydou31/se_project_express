const ClothingItem = require("../models/clothingItem");
const STATUS = require("../utils/errors");

// GET /clothing-items (or similar route)
module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then(items =>  res.status(STATUS.OK).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};

// POST /clothing-items
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
  const { name, imageUrl, weather } = req.body;
  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => res.status(STATUS.CREATED).send(item))
    .catch((err) => {
      console.error(err);
      // Handle Mongoose validation errors -> client sent bad data
      if (err && err.name === "ValidationError") {
        const errors = Object.values(err.errors || {}).map((e) => e.message);
        const combinedMessage = errors.join(". ");
        return res
          .status(STATUS.BAD_REQUEST)
          .send({ message: "Validation error", combinedMessage });
      }
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server'});
    });
};

// DELETE /items/:id
module.exports.deleteClothingItemById = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(STATUS.OK).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS.NOT_FOUND)
          .send({ message: "ClothingItem not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(STATUS.BAD_REQUEST)
          .send({ message: "incorrect id type" });
      }
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: 'An error has occurred on the server' });
    });
};
