'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: track');

const trackSchema = new Schema({
  title: {type: Schema.Types.ObjectId, required: true},
  awsKey: {type: String, required: true},
  awsURI: {type: String, required: true},
  albumID: {type: Schema.Types.ObjectId, required: true},
  userID: {type: Schema.Types.ObjectId, required: true}
})

const Track = module.exports = mongoose.model('track', trackSchema);