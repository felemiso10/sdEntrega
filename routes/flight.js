'use strict'

var express = require('express');
var flightController = require('../controllers/flight');
var router = express.Router();
var mdAuth = require('../middlewares/authenticate');

router.post('/flights', flightController.add);
router.get('/flights', flightController.getFlights);
router.get('/flights/:id',flightController.getFlightById);
router.get('/flights-preferences/:search',flightController.flightPreferences);
router.put('/book/flight/:flightId',mdAuth.authenticated,flightController.book);
router.delete('/flight/:id',mdAuth.authenticated,flightController.delete);
router.put('/flight/:id',mdAuth.authenticated,flightController.update);
module.exports = router;