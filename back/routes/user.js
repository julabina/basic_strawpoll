const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/sign', userController.sign);
router.post('/log', userController.login);

module.exports = router;