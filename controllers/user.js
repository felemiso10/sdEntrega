'use strict'

var validator = require('validator');
var User = require('../models/user');
var Flight = require('../models/flight');
var bcrypt = require('bcrypt');
var fs = require('fs');
var path = require('path');
var jwt = require ('../service/jwt');


var controller = {
    //Implemento todos los metodos del usuario
    save: function (req, res) {

        var params = req.body;

        //validar datos
        var validateName = !validator.isEmpty(params.name);
        var validateEmail = validator.isEmail(params.email) && !validator.isEmpty(params.email);
        var validatePassword = !validator.isEmpty(params.password);

        if (validateName && validateEmail && validatePassword) {
            //Asignar valores al usuario

            var user = new User();

            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.password = params.password;
            user.flights = [];
            user.cars = [];
            user.hotels = [];

            //Comprobar si el usuario existe
            User.findOne({ email: user.email }, (err, issetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad de usuario"
                    });
                }
                if (!issetUser) {
                    //Si no existe,cifrar la contra y guardarlo
                    //Cifrar
                    const saltRounds = 10;
                    bcrypt.hash(params.password, saltRounds, (err, hash) => {
                        user.password = hash;
                        //Guardar
                        user.save((err, userStored) => {
                            if (err) {
                                return res.status(500).send({
                                    message: "Error al guardar usuario"
                                });
                            }
                            if (!userStored) {
                                return res.status(500).send({
                                    message: "El usuario no se ha guardado"
                                });
                            }
                            //Devolver respuesta
                            return res.status(200).send({
                                status: 'success',
                                user: userStored
                            });

                        });
                    });
                }
                else {
                    return res.status(500).send({
                        message: "Error el usuario ya esta registrado"
                    });
                }
            });
        }
        else {
            return res.status(400).send({
                message: "La validación de datos del usuario es incorrecta"
            });
        }
    },

    login: function (req, res) {
        //Recoger los parametros de la peticion
        var params = req.body;
        //Validar los datos 
        var validateEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validatePassword = !validator.isEmpty(params.password);

        if (validateEmail && validatePassword) {
            //Buscar usuarios que coincidan con el email
            User.findOne({ email: params.email.toLowerCase() }, (err, user) => {

                if (err) {
                    return res.status(500).send({
                        message: "Error al intentar identificarse"

                    });
                }

                if (!user) {
                    return res.status(404).send({
                        message: "El usuario no existe"

                    });
                }
                //Si lo encuentra, 
                //Comprobar la contraseña
                bcrypt.compare(params.password, user.password, (err, check) => {

                    //Si es ok,
                    if (check) {
                        //Generar token jwt y devolverlo
                        if (params.gettoken) {
                            //Devolver los datos
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }

                        //Limpiar el objeto User lo hago para que el cliente no pueda acceder a la contraseña
                        user.password = undefined;
                        //Devolver los datos
                        return res.status(200).send({
                            message: "success",
                            user

                        });
                    }
                    else {
                        return res.status(404).send({
                            message: "Las credenciales no son correctas"
                        });
                    }
                });

            });

        }
        else {
            return res.status(500).send({
                message: "los datos no son correctos"
            });
        }
    },
    update: function (req, res) {
         //Recoger los datos
         var params = req.body;
 
         //Eliminar propiedades innecesarias
         delete params.password;
 
         //Comprobar si el email es único
         if(req.user.email != params.email){
             User.findOne({email: params.email.toLowerCase()},(err,user)=>{
                 
                 if(err){
                     return res.status(500).send({
                         message: "Error al intentar identificarse"
                      
                     });
                 }
                 
                 if(user && user.email == params.email){
                     return res.status(404).send({
                         message: "El email no puede ser modificado"
                         
                     });
                 }
                 else{
                     //Buscar y actualizar 
                     var userId = req.user.sub;
                     User.findOneAndUpdate({_id: userId},params,{new:true},(err,userUpdated) =>{
 
                         if(err){
                             return res.status(500).send({
                                 status: 'Error',
                                 message: 'error al actualizar'
                             });
                         }
                         if(!userUpdated){
                             return res.status(500).send({
                                 status:'error',
                                 user:userUpdated
                             });
                         }
                         //Devolver respuesta
                         return res.status(200).send({
                             status:'success',
                             user:userUpdated
                         });
                     });
                 }
             });
         }
         else{
             //Buscar y actualizar 
             var userId = req.user.sub;
             User.findOneAndUpdate({_id: userId},params,{new:true},(err,userUpdated) =>{
 
                 if(err){
                     return res.status(500).send({
                         status: 'Error',
                         message: 'error al actualizar'
                     });
                 }
                 if(!userUpdated){
                     return res.status(500).send({
                         status:'error',
                         user:userUpdated
                     });
                 }
                 //Devolver respuesta
                 return res.status(200).send({
                     status:'success',
                     user:userUpdated
                 });
             });
         }
    }
}

module.exports = controller;