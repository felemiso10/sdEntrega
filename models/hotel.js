'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

var hotelSupplierSchema = Schema({
    name: String,
    city: String,
    country: String,
    numberOfBeds: Number,
    pricePerNight: Number,
    roomType: String,
    reserved: Boolean,
    checkIn: String,
    checkOut: String,
    image: String
});


//Paginado

hotelSupplierSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Hotel',hotelSupplierSchema);