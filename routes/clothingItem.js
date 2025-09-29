const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItemById,
} = require("../controllers/clothingItems");

const { likeItem, dislikeItem } = require("../controllers/likes");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItemById); // delete request to /items/1281289f1j298j19j1
// req.params = {itemId: 1281289f1j298j19j1}
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
