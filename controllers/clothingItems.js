const ClothingItem = require('../models/clothingItem');

// GET /clothing-items (or similar route)
module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      if (!items || items.length === 0) {
        return res.status(404).send({ message: 'No clothing items found' });
      }
      return res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

// POST /clothing-items
module.exports.createClothingItem = (req, res) => {
   console.log(req.user._id);
  const { name, imageUrl, weather, owner } = req.body;
  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      // Handle Mongoose validation errors -> client sent bad data
      if (err && err.name === 'ValidationError') {
        const errors = Object.values(err.errors || {}).map(e => e.message);
        return res.status(400).send({ message: 'Validation error', errors });
      }
      return res.status(500).send({ message: err.message });
    });
};

// DELETE /items/:id
module.exports.deleteClothingItemById = (req, res) => {
  const { id } = req.params;
  ClothingItem.findByIdAndDelete(id)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).send({ message: 'ClothingItem not found' });
      }
      return res.send( deleted);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

