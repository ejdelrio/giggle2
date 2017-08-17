'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: album');

const albumSchema = new Schema({
  title: {type: String, required: true},
  datePublished: {type: Date, default: Date.now},
  userID: {type: Schema.Types.ObjectId, required: true},
  tracks: [{type: Schema.Types.ObjectId, ref:'track'}]
});

const Album = module.exports = mongoose.model('album', albumSchema);