const express = require('express');
const router = express.Router();

const pollController = require('../controllers/poll');

router.post('/create', pollController.create);
router.get('/getOne/:id', pollController.getOne);

module.exports = router;