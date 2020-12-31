'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
//Ejecutar express
var app = express();


//Cargar archivos de rutas
var userRoutes = require('./routes/user');
var flightRoutes = require('./routes/flight');
var carRoutes = require('./routes/car');
var hotelRoutes = require('./routes/hotel');


//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());



//Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//Reescribir rutas
app.use('/api',userRoutes);
app.use('/api',flightRoutes);
app.use('/api',carRoutes);
app.use('/api',hotelRoutes);
//Exportar el modulo
module.exports = app;