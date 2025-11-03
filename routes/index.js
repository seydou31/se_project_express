const router = require('express').Router();
const userRouter = require('./users');
const clothingItemRouter = require('./clothingItem');
const {
  createUser,
  login
} = require("../controllers/users");
const {validateUserInfo, validateLoginInfo} = require("../middlewares/validation")



router.use('/users', userRouter);
router.use('/items', clothingItemRouter );
router.post('/signup', validateUserInfo,  createUser);
router.post('/signin', validateLoginInfo, login)

module.exports = router;