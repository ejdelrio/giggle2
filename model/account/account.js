'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle:account')

const accountSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, required: true, unique: true},
  bookings: [{type: Schema.Types.ObjectId, ref: 'booking'}],
  inbox: [{type: Schema.Types.ObjectId, ref: 'message'}],
  photos: [{type: Schema.Types.ObjectId, ref: 'photo'}],
  video: [{type: Schema.Types.ObjectId, ref: 'video'}],
  location: {type: Schema.Types.ObjectId, ref: 'location'}
})

const Account = module.exports = mongoose.model('account', accountSchema);
