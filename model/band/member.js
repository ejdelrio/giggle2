'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle: member');

const memberSchema = new Schema({
  name: {typ: String, required: true},
  bandID: {type: Schema.Types.ObjectId, required: true},
  userID: {type: Schema.Types.ObjectId, required: true},
  bio: {type: String, required: false},
  instruments: {type: String, required: false}
})

const Member = module.exports = mongoose.model('member', memberSchema);