'use strict'

var express = require('express');
var carController = require('../controllers/car');
var router = express.Router();
var mdAuth = require('../middlewares/authenticate');


router.post('/car',carController.add);
router.get('/cars',carController.getCars);
router.get('/cars/:id',carController.getCarById);
router.get('/cars-preferences/:search',carController.carPreferences);
router.put('/book/cars/:carId',mdAuth.authenticated,carController.book);
router.delete('/car/:id',mdAuth.authenticated,carController.delete);
router.put('/car/:id',mdAuth.authenticated,carController.update);


module.exports = router;