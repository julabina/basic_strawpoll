const express = require('express');
const router = express.Router();

const pollController = require('../controllers/poll');

router.post('/create', pollController.create);
router.get('/getOne/:id', pollController.getOne);
router.post('/vote/:id', pollController.vote);
router.get('/getAll/:id', pollController.getAll);
router.put('/acceptTemp/:id', pollController.acceptTemp);
router.delete('/deleteTemp/:id', pollController.deleteTemp);

module.exports = router;