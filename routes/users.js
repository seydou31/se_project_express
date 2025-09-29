const router = require("express").Router();

const {
  getUsers,
  getSpecificUser,
  createUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getSpecificUser);

module.exports = router;
