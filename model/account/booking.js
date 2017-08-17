'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle:booking');

const bookingSchema = new Schema({
  bandUserID: {type: Schema.Types.ObjectId, required: true},
  venueUserID: {type: Schema.Types.ObjectId, required: true},
  location: {type: Schema.Types.ObjectId, required: false, ref: 'location'},
  compensation: {type: Number, required: false},
  date: {type: Date, required: true, default: Date.now},
  bandConfirm: {type: Boolean, default: false},
  venueConfirm: {type: Boolean, default: false}
})

const Booking = module.exports = mongoose.model('booking', bookingSchema);