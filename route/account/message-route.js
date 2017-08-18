'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('giggle:message router');
const createError = require('http-errors');
const bearerAuth = require('../../lib/bearer-auth.js');

const Account = require('../../model/account/account.js');
const User = require('../../model/user.js');
const Message = require('../../model/account/message.js');
const messageRouter = module.exports = new Router ();

messageRouter.post('/api/message/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/message/id');
  
  req.body.userID = req.params.id;
  req.body.senderID = req.user._id;
  let newMessage = new Message(req.body);

  Account.findOne({userID: req.params.id})
  .then(account => {
    account.inbox.push(newMessage._id);
    account.save()
  })
  .then(() => newMessage.save())
  .then(message => res.json(message))
  .catch(err => next(createError(404, err.Message)));
});

messageRouter.delete('/api/message/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/message/id');
  Message.findOneAndRemove({
    _id: req.params.id,
    userID: req.user._id
  })
  .then(() => Account.findOne({
    userID: req.user._id
  }))
  .then(account => {
    let target = account.inbox.indexOf(req.params.id);
    account.inbox.splice(target, 1);
    return account.save();
  })
  .then(() => {
    res.status(204);
    res.send('Message Deleted');
    res.end();
  })
  .catch(err => next(createError(404, err.message)))
})