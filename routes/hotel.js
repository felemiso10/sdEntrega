'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel');
var router = express.Router();
var mdAuth = require('../middlewares/authenticate');


router.post('/hotel',hotelController.add);
router.get('/hotels',hotelController.getHotels);
router.get('/hotels/:id',hotelController.getHotelById);
router.get('/hotels-preferences/:search',hotelController.hotelPreferences);
router.put('/book/hotels/:hotelId',mdAuth.authenticated,hotelController.book);
router.delete('/hotel/:id',mdAuth.authenticated,hotelController.delete);
router.put('/hotel/:id',mdAuth.authenticated,hotelController.update);


module.exports = router;