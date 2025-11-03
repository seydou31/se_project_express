const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItemById,
} = require("../controllers/clothingItems");

const { likeItem, dislikeItem } = require("../controllers/likes");
const {validateClothingItem, validateItemId} = require("../middlewares/validation")

router.get("/", getClothingItems);
router.post("/", validateClothingItem, auth, createClothingItem);
router.delete("/:itemId", validateItemId,  auth, deleteClothingItemById);
router.put("/:itemId/likes", validateItemId, auth, likeItem);
router.delete("/:itemId/likes", validateItemId, auth, dislikeItem);

module.exports = router;
