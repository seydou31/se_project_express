const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const {validateProfileUpdate} = require("../middlewares/validation")

router.get("/me", auth, getCurrentUser);
router.patch("/me", validateProfileUpdate, auth, updateProfile);

module.exports = router;
