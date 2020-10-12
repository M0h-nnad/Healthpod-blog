const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../middlerware/multer.storage');

const UserRequestModule = require('../data/user.request');

router.post('/login', UserRequestModule.LogIn);
router.post('/signup', UserRequestModule.createUser);
router.post('/logout',  UserRequestModule.Logout);
router.put('/update/:id', multer({storage:storage}).single('photo'),UserRequestModule.UpdateUser);
router.get("/:id", UserRequestModule.getUser);
router.get('/', UserRequestModule.getUsers);

module.exports = router;
