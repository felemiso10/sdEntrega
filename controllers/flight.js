"use strict";

var validator = require("validator");
var Flight = require("../models/flight");
var User = require("../models/user");


var controller = {
  add: function (req, res) {
    var params = req.body;

    
    try {
      var validateSince = !validator.isEmpty(params.since);
      var validateTo = !validator.isEmpty(params.to);
      var validatePrice = !validator.isEmpty(params.price);
      var validateCabinClass = !validator.isEmpty(params.cabinClass);
  } catch (err) {
      return res.status(400).send({
          status: 'error',
          message:"Faltan datos por enviar"
      })
  }
    
    if(validateSince && validateTo && validateCabinClass && validatePrice){
      var flight = new Flight();

    flight.since = params.since;
    flight.to = params.to;
    flight.cabinClass = params.cabinClass;
    flight.reserved = false;
    flight.image = null;
    flight.price = params.price;

    console.log(flight);

    flight.save((err, flightStored) => {
      console.log(flightStored);
      if (err || !flightStored) {
        return res.status(400).send({
          message: "Error al guardar",
        });
      } else {
        //Respuesta
        return res.status(200).send({
          status: "success",
          flight: flightStored,
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
  getFlights: function (req, res) {
    //Recoger pagina actual
    if (req.params.page == null || req.param.page == undefined) {
      var page = 1;
    } else {
      var page = parseInt(req.params.page);
    }

    //Indicar opciones de paginacion
    var options = {
      sort: { date: -1 }, //Orden descendente
      limit: 5,
      page: page,
    };
    //Find paginado
    Flight.paginate({}, options, (err, flights) => {
      if (err) {
        return res.status(400).send({
          message: "Error al hacer la consulta",
        });
      }

      if (!flights) {
        return res.status(404).send({
          message: "No hay vuelos",
        });
      }

      //Devolver el resultado (topics, total de topic, total de paginas)
      return res.status(200).send({
        status: "success",
        flights: flights.docs,
        totalDocs: flights.totalDocs,
        totalPages: flights.totalPages,
      });
    });
  },
  getFlightById: function (req, res) {
    //Sacar id
    var flightId = req.params.id;
    //Find por el id
    Flight.findById(flightId).exec((err, flight) => {
      if (err) {
        return res.status(400).send({
          message: "error",
        });
      }
      if (!flight) {
        return res.status(404).send({
          message: "No hay vuelos",
        });
      }

      return res.status(200).send({
        status: "success",
        flight,
      });
    });
  },

  flightPreferences: function (req, res) {
    var params = req.params.search;

    console.log(params);
    Flight.find({
      $or: [
        { "since": { "$regex": params, "$options": "i" } },
        { "to": { "$regex": params, "$options": "i" } },
        { "cabinClass": { "$regex": params, "$options": "i" } },
      ],
    }).exec((err, flights) => {
      if (err) {
        //Devolver respuesta
        return res.status(400).send({
          message: "error en la peticion",
          err
        });
      }

      if (flights.length == 0) {
        return res.status(400).send({
          message:
            "No se han encontrado vuelos de su preferencia, a continuación, revise la página de vuelos",
        });
      }

      return res.status(200).send({
        status: "success",
        flights,
      });
    });
  },

  book: function (req, res) {
    var flightId = req.params.flightId;
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

        Flight.findById(flightId).exec((err, flight) => {
            if (err) {
              return res.status(400).send({
                message: "Error en la petición",
              });
            }
            if (!flight) {
              return res.status(400).send({
                message: "No se ha encontrado el vuelo",
              });
            }
        if(flight.reserved == true){
            return res.status(400).send({
                message: 'Ya está reservado este vuelo'
            });
        }
        
        flight.reserved = true;
        flight.save((err) => {
            if(err){
                return res.status(400).send({
                    message: 'error'
                })
            }
        })

        user.flights.push(flightId);
        user.save((err) => {
            if (err) {
                return res.status(400).send({
                    message: "Error en guardar el vuelo"
                });
            }

            //Devolver una respuesta
            return res.status(200).send({
                status: 'success',
                user
            });
        });
    });
    });
  },
  delete: function (req,res){
    var flightId = req.params.id;

    Flight.findByIdAndDelete({_id:flightId, user:req.user.sub}, (err, flightDeleted)=>{
      if(err){
        //Devolver respuesta
        return res.status(400).send({
            message: 'error en la peticion',
    
        });
      }
      if(!flightDeleted){
        return res.status(404).send({
          message: 'No se ha borrado el vuelo',
  
        });
      }
      return res.status(200).send({
        status: 'success',
        flight: flightDeleted
      });
    })
  },
  update: function (req, res) {
      var flightId = req.params.id;
      //Recojo los datos
      var params = req.body;

      var update = {
        since: params.since,
        to: params.to,
        price: params.price,
        cabinClass: params.cabinClass
      }
      Flight.findOneAndUpdate({_id:flightId},update,{new:true}, (err,flightUpdated) =>{
        if(err){
          //Devolver respuesta
          return res.status(400).send({
              status: "error",
              message: 'error en la peticion',
      
          });
        }
        if(!flightUpdated){
          return res.status(404).send({
            status: "error",
            message: 'No se ha actualizado el vuelo',
          });
        }

         //Devolver respuesta
         return res.status(200).send({
          status: 'success',
          flight: flightUpdated
      });

      })

  }
};

module.exports = controller;
