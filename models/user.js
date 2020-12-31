'use strict'

var mongoose = require('mongoose');
const { schema } = require('./flight');
var Schema = mongoose.Schema;


var userSchema = Schema ({
    name: String,
    surname: String,
    email: String,
    password: String,
    cardNumber: String,
    cardHolder: String,
    dateOfExpiry: String,
    cvc: Number,
    flights: [{type: Schema.Types.ObjectId, ref: 'Flight',autopopulate: true}],
    cars: [{type: Schema.Types.ObjectId, ref: 'Car',autopopulate: true}],
    hotels: [{type: Schema.Types.ObjectId, ref: 'Hotel',autopopulate: true}],
});

userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('User',userSchema);
                                //lowercase y pluralizar nombre
                                //users-> schema