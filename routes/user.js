'use strict'

var express = require('express');
var userController = require('../controllers/user');
var mdAuth = require('../middlewares/authenticate');

var router = express.Router();

//Creo las rutas
router.post('/register',userController.save);   
router.post('/login',userController.login);
router.put('/update',mdAuth.authenticated,userController.update);
//Exportar 
module.exports = router;