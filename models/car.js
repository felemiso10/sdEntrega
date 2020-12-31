'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

var carSupplierSchema = Schema({
    name: String,
    model: String,
    brand: String,
    type: String,
    numberOfDoors: Number,
    pricePerDay: Number,
    image: String,
    reserved: Boolean,
    rentedDays: Number   
});


//Paginado

carSupplierSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Car',carSupplierSchema);