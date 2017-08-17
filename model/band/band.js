'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle:band');

const bandSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, required: true,},
  name: {type: String, required: true},
  members: [{type: Schema.Types.ObjectId, ref: 'member'}],
  albums: [{type: Schema.Types.ObjectId, ref: 'album'}],
  bio: {type: String, required: false},
  genre: {type: String, required: true}
});

const Band = module.exports = mongoose.model('band', bandSchema);