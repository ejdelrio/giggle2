'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const debug = require('debug')('giggle:user');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  findHash: { type: String, unique: true},
  accountID: {type: Schema.Types.ObjectId, required: true, ref: 'account', unique: true},
  bandID: {type: Schema.Types.ObjectId, required: false, ref: 'band'},
  venueID: {type: Schema.Types.ObjectId, required: false, ref: 'venue'},
});

userSchema.methods.encryptPassword = function(password) {
  debug('generatePasswordHash');
  
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
}

userSchema.methods.comparePassword = function(password) {
  debug('comparePassword');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
}

userSchema.methods.generateHash = function() {
  debug('generateFindHash');
  
  return new Promise((resolve, reject) => {
    let tries = 0;

  _generateHash.call(this);

    function _generateHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch( err => {
        if ( tries > 3) return reject(err);
        tries++;
        _generateHash.call(this);
      });
    }
  });
}

userSchema.methods.generateToken = function() {
  debug('generateToken');
  
  return new Promise((resolve, reject) => {
    this.generateHash()
    .then( findHash => resolve(jwt.sign({ token: findHash }, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
}

module.exports = mongoose.model('user', userSchema);