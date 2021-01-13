'use strict'

var validator = require('validator');
var Car = require('../models/car');
var User = require('../models/user');

var controller = {

    add: function(req,res) {
        var params = req.body;
        

        try {
            var validateModel = !validator.isEmpty(params.model);
            var validateBrand = !validator.isEmpty(params.brand);
            var validateType =  !validator.isEmpty(params.type);
            var validatePricePerDay = !validator.isEmpty(params.pricePerDay);
            var validateNumberOfDoors = !validator.isEmpty(params.numberOfDoors);
        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message:"Faltan datos por enviar"
            })
        }


        if(validateBrand && validateModel && validatePricePerDay && validateNumberOfDoors && validateType){
            
            var car = new Car();

            car.model = params.model;
            car.brand = params.brand;
            car.type = params.type;
            car.numberOfDoors = params.numberOfDoors;
            car.pricePerDay = params.pricePerDay;
            car.image = null;
            car.reserved = false;


            car.save((err,carStored)=>{
                console.log(carStored);
                if(err || !carStored){
                    return res.status(400).send({
                        message:'Error al guardar'
                    });
                }

                else{
                    //Respuesta
                    return res.status(200).send({
                        status: 'success',
                        car: carStored
                    });


                }
                
            });
        }
        else{
            return res.status(400).send({
                status: 'error',
                message: 'Error en la validación'
            });
        }
    },

    getCars: function (req,res) {
        
        //Find paginado
            Car.find().exec((err,cars)=>{
                if(err || !cars){
                    return res.status(404).send({
                        message: 'No hay coches'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    cars: cars
                });
            })
    },

    getCarById: function (req, res) {
         //Sacar id
         var carId = req.params.id;
         //Find por el id 
         Car.findById(carId)
             .exec((err,car)=>{
                 if(err){
                     return res.status(400).send({
                         message: 'error'
                     });
                 }
                 if(!car){
                     return res.status(404).send({
                         message: 'No hay vuelos'
                     });
                 }
 
                 return res.status(200).send({
                     status: 'success',
                     car: car
                 })
             });
    },

    carPreferences: function (req,res) {
        var params = req.params.search;

        console.log(params);
        Car.find({"$or":[
            {"model":{"$regex":params,"$options": "i"}},
            {"brand":{"$regex":params,"$options": "i"}},
            {"type":{"$regex":params,"$options": "i"}},
            ]
        })
        .exec((err,cars)=>{
            if(err){
                //Devolver respuesta
                return res.status(400).send({
                    message: 'error en la peticion',
            
                });
            }

            if(cars.length == 0) {
                return res.status(400).send({
                    message: 'No se han encontrado coches de su preferencia, a continuación, revise la página de coches'
                });
            }
            
            return res.status(200).send({
                status: 'success',
                cars
            });
        });
    },
    book: function(req,res){
        var carId = req.params.carId;
        var userId = req.user.sub;

        User.findByIdAndUpdate(userId).exec((err, user) => {

            if (err) {
                return res.status(400).send({
                    message: 'Error en la petición'
                });
            }
    
            if (!user) {
                return res.status(400).send({
                    message: 'No se ha encontrado el usuario'
                });
            }
    
            Car.findById(carId).exec((err, car) => {
                if (err) {
                  return res.status(400).send({
                    message: "Error en la petición",
                  });
                }
                if (!car) {
                  return res.status(400).send({
                    message: "No se ha encontrado el coche",
                  });
                }
            if(car.reserved == true){
                return res.status(400).send({
                    message: 'Ya está reservado este coche'
                });
            }
            
            car.reserved = true;
            car.save((err) => {
                if(err){
                    return res.status(400).send({
                        message: 'error'
                    })
                }
            })
    
            user.cars.push(car);
            user.save((err) => {
                if (err) {
                    return res.status(400).send({
                        message: "Error en guardar el coche"
                    });
                }
    
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    user:user,
                    carReserved:car
                });
            });
        });
        });

    },
    delete: function (req,res){
        var carId = req.params.id;
    
        Car.findByIdAndDelete({_id:carId, user:req.user.sub}, (err, carDeleted)=>{
          if(err){
            //Devolver respuesta
            return res.status(400).send({
                message: 'error en la peticion',
        
            });
          }
          if(!carDeleted){
            return res.status(404).send({
              message: 'No se ha borrado el coche',
      
            });
          }
          return res.status(200).send({
            status: 'success',
            coche: carDeleted
          });
        })
      },
      update: function (req, res) {
          var carId = req.params.id;
          //Recojo los datos
          var params = req.body;
    
          var update = {
            model:params.model,
            brand:params.brand,
            type:params.type,
            pricePerDay:params.pricePerDay,
            numberOfDoors:params.numberOfDoors,
            rentedDays:params.rentedDays
          }
          Car.findOneAndUpdate({_id:carId},update,{new:true}, (err,carUpdated) =>{
            if(err){
              //Devolver respuesta
              return res.status(400).send({
                  status: "error",
                  message: 'error en la peticion',
          
              });
            }
            if(!carUpdated){
              return res.status(404).send({
                status: "error",
                message: 'No se ha actualizado el coche',
              });
            }
    
             //Devolver respuesta
             return res.status(200).send({
              status: 'success',
              coche: carUpdated
          });
    
          })
      }
}

module.exports = controller;