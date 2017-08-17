'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: venue');

const venueSchema = new Schema({
  name: {type: String, required: true},
  userID : {type: Schema.Types.ObjectId},
  desc: {type: String, required: false},
  genre: {type: String, required: false}
})

const Venue = module.exports = mongoose.model('venue', venueSchema);