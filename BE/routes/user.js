const express = require('express');
const router = express.Router();
const { getUsers, getMessageContacts, getMe, getUser, updateUser } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const upload = require("../middleware/upload");

router.get('/', getUsers);
router.get('/contacts', authenticate, getMessageContacts);
router.get('/me', authenticate, getMe);
router.get('/:id', authenticate, getUser);
router.put("/me", authenticate, upload.single("avatar"), updateUser);

module.exports = router;