const express = require('express');
const router = express.Router();
const UserController = require('../app/api/controllers/user');

router.get('/', UserController.getAll);
router.post("/filter", UserController.getFilter);
router.get('/:userId', UserController.getById);
router.put('/:userId', UserController.updateById);
router.delete('/:userId', UserController.deleteById);
module.exports = router;