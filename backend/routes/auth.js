const express = require('express');
const router = express.Router();
const UserController = require('../app/api/controllers/user');

router.post('/register', UserController.create);
router.post('/login', UserController.login);
router.post('/check', UserController.checkToken);
router.post("/forgetPassword", UserController.forgetPassword);
router.post("/changePassword", UserController.changePassword);
router.post("/resetPassword", UserController.resetPassword);
router.post("/verifyEmail", UserController.verifyEmail);
module.exports = router;