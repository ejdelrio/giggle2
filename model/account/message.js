'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('giggle:message');

const messageSchema = new Schema({
  content: {type: String, required: true},
  dateSent: {type: Date, default: Date.now},
  userID: {type: Schema.Types.ObjectId, required: true},
  senderID: {type: Schema.Types.ObjectId, required: true}
})

const Message = module.exports = mongoose.model('message', messageSchema);