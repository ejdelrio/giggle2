'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle:user-route');
const createError = require('http-errors');
const basicAuth = require('../lib/basic-auth.js');
const jsonParser = require('body-parser').json();

const userRouter = module.exports = new Router();

const User = require('../model/user.js');
const Account = require('../model/account/account.js');

userRouter.post('/api/signup/', jsonParser, function(req, res, next) {
  debug('POST /api/signup');
  
  let password = req.body.password;
  delete req.body.password;
  
  let newUser = new User(req.body);
  let newAccount = new Account({userID: newUser._id});
  newUser.accountID = newAccount._id;

  newAccount.save()
  .then(() => newUser.encryptPassword(password))
  .then(user => user.save())
  .then(user => user.generateHash())
  .then(token => res.send(token))
  .catch(err => next(createError(400, err.message)));

});

userRouter.get('api/login', basicAuth, function(req, res, next) {
  debug('GET /api/login');
  User.findOne({ username: req.auth.username })
  .then( user => user.comparePasswordHash(req.auth.password))
  .then( user => user.generateToken())
  .then( token => res.send(token))
  .catch(next);
});