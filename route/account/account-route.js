'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: Account Router');
const createError = require('http-errors');
const User = require('../../model/user.js');
const Account = require('../../model/account/account.js');
const bearerAuth = require('../../lib/bearer-auth.js');

const accountRouter = module.exports = new Router();

accountRouter.get('/api/account', bearerAuth, function(req, res, next) {
  debug('GET /api/account');
  console.log(req.user)
  Account.findOne({userID: req.user._id})
  .then(account => res.json(account))
  .catch(err => next(createError(404, err.message)));
});

accountRouter.delete('/api/account', bearerAuth, function(req, res, next) {
  debug('DELETE /api/account');

  Account.findOneAndRemove({userID: req.user._id})
  .then(() => {
    res.status(204);
    res.send('Account Deleted');
    res.end();
  })
  .catch(err => next(createError(404, err.message)));
})