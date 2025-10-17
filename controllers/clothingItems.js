const ClothingItem = require("../models/clothingItem");
const STATUS = require("../utils/errors");

// GET /clothing-items (or similar route)
module.exports.getClothingItems = (req, res) => {
   ClothingItem.find({})
    .then((items) => res.status(STATUS.OK).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// POST /clothing-items
module.exports.createClothingItem = (req, res) => {
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
        .send({ message: "An error has occurred on the server" });
    });
};

// DELETE /items/:id
module.exports.deleteClothingItemById = (req, res) => {
  const { itemId } = req.params;

 return  ClothingItem.findById(itemId)
    .orFail(new Error("item not found"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        const err = new Error('Not authorized to delete item');
        err.status = STATUS.FORBIDDEN;
        throw err;
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err && err.status === STATUS.FORBIDDEN) {
        return res.status(STATUS.FORBIDDEN).send({ message: err.message });
      }

      if (err && err.name === 'CastError') {
        return res.status(STATUS.BAD_REQUEST).send({ message: 'Invalid item id' });
      }

      if (
        err &&
        (err.message === "item not found" || err.name === "DocumentNotFoundError")
      ) {
        return res.status(STATUS.NOT_FOUND).send({ message: "item not found" });
      }

      return res
        .status(STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

