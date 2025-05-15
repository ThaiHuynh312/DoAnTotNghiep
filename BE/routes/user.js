const express = require('express');
const router = express.Router();
const { getUsers, getMessageContacts, getMe, getUser, updateUser, searchUsers, suggestUsers } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const {upload} = require("../middleware/upload");


router.get("/search", authenticate, searchUsers);
router.get('/', getUsers);
router.get('/contacts', authenticate, getMessageContacts);
router.get('/me', authenticate, getMe);
router.put("/me", authenticate, upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]), updateUser);
router.get('/suggestions', authenticate, suggestUsers);
router.get('/:id', authenticate, getUser);



module.exports = router;