const router = require('express').Router();
const { getUserInfo, updateUser } = require('../controllers/users');
const { validateUserInfo } = require('../middlewares/validation');

router.get('/me', getUserInfo);
router.patch('/me', validateUserInfo, updateUser);

module.exports = router;
