'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

var flightProviderSchema = Schema({
    since: String,
    to: String,
    departure: String,
    return: String,
    cabinClass: String,
    reserved: Boolean,
    price: Number,
    image: String
});

//Paginado
flightProviderSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Flight',flightProviderSchema);

