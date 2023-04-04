const express = require('express');
const router = express.Router();

const pollController = require('../controllers/poll');

router.post('/create', pollController.create);

module.exports = router;