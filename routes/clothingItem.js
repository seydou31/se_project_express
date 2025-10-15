const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItemById,
} = require("../controllers/clothingItems");

const { likeItem, dislikeItem } = require("../controllers/likes");

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItemById);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
