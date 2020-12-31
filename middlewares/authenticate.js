'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "1117";

exports.authenticated = function (req,res,next){

    //Comprobar si llega autorizacion
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "La peticion no tiene la cabecera de autorizacion"
        });
    }
    //Limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g,'');
   
    try{
        //Decodificar token
        var payload = jwt.decode(token,secret);

        //Comprobar si el token ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: "El token no es valido"
            });
        }

    }
    catch(ex){
        return res.status(404).send({
            message: "El token no es valido"
        });
    }
    

    //Adjuntar usuario identificado a request

    req.user = payload;

    next();
};
