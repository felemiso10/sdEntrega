"use strict";

var validator = require("validator");
var Hotel = require("../models/hotel");
var User = require("../models/user");

var controller = {
  add: function (req, res) {
    var params = req.body;
    console.log(params)
    

    //Validar los datos
    try {
      var validateName = !validator.isEmpty(params.name);
      var validateCity = !validator.isEmpty(params.city);
      var validateCountry = !validator.isEmpty(params.country);
      var validateNumberOfBeds = !validator.isEmpty(params.numberOfBeds);
      var validatePricePerNight = !validator.isEmpty(params.pricePerNight);
      var validateRoomType = !validator.isEmpty(params.roomType);
      console.log(validateName, "nombre ")
  } catch (err) {
      return res.status(400).send({
          status: 'error',
          message:"Faltan datos por enviar"
      })
  }

    if(validateCity && validateCountry && validateName && validateNumberOfBeds && validatePricePerNight && validateRoomType){
      var hotel = new Hotel();
      hotel.name = params.name;
      hotel.city = params.city;
      hotel.country = params.country;
      hotel.numberOfBeds = params.numberOfBeds;
      hotel.pricePerNight = params.pricePerNight;
      hotel.roomType = params.roomType;
      hotel.reserved = false;
      hotel.image = null;

      console.log(hotel);

      hotel.save((err, hotelStored) => {
        console.log(hotelStored);
        if (err || !hotelStored) {
          return res.status(400).send({
            message: "Error al guardar",
          });
        } else {
          //Respuesta
          return res.status(200).send({
            status: "success",
            hotel: hotelStored,
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
  getHotels: function (req, res) {
    Hotel.find().exec((err,hotels)=>{
      if(err || !hotels){
          return res.status(404).send({
              message: 'No hay coches'
          });
      }
      return res.status(200).send({
          status: 'success',
          hotels: hotels
      });
  })
  },

  getHotelById: function (req, res) {
    //Sacar id
    var hotelId = req.params.id;
    //Find por el id
    Hotel.findById(hotelId).exec((err, hotel) => {
      if (err) {
        return res.status(400).send({
          message: "error",
        });
      }
      if (!hotel) {
        return res.status(404).send({
          message: "No hay vuelos",
        });
      }

      return res.status(200).send({
        status: "success",
        hotel: hotel,
      });
    });
  },

  hotelPreferences: function (req, res) {
    var params = req.params.search;

    console.log(params);
    Hotel.find({
      $or: [
        { "city": { "$regex": params, "$options": "i" } },
        { "country": { "$regex": params, "$options": "i" } },
        { "roomType": { "$regex": params, "$options": "i" } },
        { "name": { "$regex": params, "$options": "i" } },
      ],
    }).exec((err, hotels) => {
      if (err) {
        //Devolver respuesta
        return res.status(400).send({
          message: "error en la peticion",
        });
      }

      if (hotels.length == 0) {
        return res.status(400).send({
          message:
            "No se han encontrado hoteles de su preferencia, a continuación, revise la página de hoteles",
        });
      }

      return res.status(200).send({
        status: "success",
        hotels,
      });
    });
  },
  book: function (req, res) {
    var hotelId = req.params.hotelId;
    var userId = req.user.sub;
    User.findByIdAndUpdate(userId).exec((err, user) => {
      if (err) {
        return res.status(400).send({
          message: "Error en la petición",
        });
      }

      if (!user) {
        return res.status(400).send({
          message: "No se ha encontrado el usuario",
        });
      }

      Hotel.findById(hotelId).exec((err, hotel) => {
        if (err) {
          return res.status(400).send({
            message: "Error en la petición",
          });
        }
        if (!hotel) {
          return res.status(400).send({
            message: "No se ha encontrado el hotel",
          });
        }

        if (hotel.reserved == true) {
          return res.status(400).send({
            message: "Ya está reservado este hotel",
          });
        }

        hotel.reserved = true;
        hotel.save((err) => {
          if (err) {
            return res.status(400).send({
              message: "error",
            });
          }
        });

        user.hotels.push(hotel);
        user.save((err) => {
          if (err) {
            return res.status(400).send({
              message: "Error en guardar el hotel",
            });
          }

          //Devolver una respuesta
          return res.status(200).send({
            status: "success",
            user,
          });
        });
      });
    });
  },
  delete: function (req,res){
    var hotelId = req.params.id;

    Hotel.findByIdAndDelete({_id:hotelId, user:req.user.sub}, (err, hotelDeleted)=>{
      if(err){
        //Devolver respuesta
        return res.status(400).send({
            message: 'error en la peticion',
    
        });
      }
      if(!hotelDeleted){
        return res.status(404).send({
          message: 'No se ha borrado el hotel',
  
        });
      }
      return res.status(200).send({
        status: 'success',
        hotel: hotelDeleted
      });
    })
  },
  update: function (req, res) {
      var hotelId = req.params.id;
      //Recojo los datos
      var params = req.body;

      var update = {
        name: params.name,
        city: params.city,
        pricePerNight: params.pricePerNight,
        numberOfBeds: params.numberOfBeds,
      }
      Hotel.findOneAndUpdate({_id:hotelId},update,{new:true}, (err,hotelUpdated) =>{
        if(err){
          //Devolver respuesta
          return res.status(400).send({
              status: "error",
              message: 'error en la peticion',
      
          });
        }
        if(!hotelUpdated){
          return res.status(404).send({
            status: "error",
            message: 'No se ha actualizado el hotel',
          });
        }

         //Devolver respuesta
         return res.status(200).send({
          status: 'success',
          hotel: hotelUpdated
      });

      })

  }
};

module.exports = controller;
