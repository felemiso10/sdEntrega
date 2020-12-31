'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var https = require('https');
var fs = require('fs');
var url = 'mongodb+srv://rmg150:unrayodesol10@cluster0.vopmu.mongodb.net/agenciaViajes?retryWrites=true&w=majority';


//Opciones
const optionsHttps={
    key:fs.readFileSync('./cert/key.pem'),
    cert:fs.readFileSync('./cert/cert.pem')

};


var port = 3000;
//Conexion a la BD

//Creo la BD
mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true  })
    .then(()=>{
        console.log('La conexion a la BD se ha establecido')

        //Crear el servidor

        https.createServer(optionsHttps,app).listen(port, ()=>{
            console.log('El server está escuchando en https');
        });
    })
    .catch(error => console.log(error));