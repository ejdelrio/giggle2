'use strict';

const createError = require('http-errors');
const debug = require('debug')('giggle:error-middleware');

module.exports = function(err, req, res, next) {
  debug('error middleware');

  console.error('message:', err.message);
  console.error('name:', err.name);
  console.error(err.fileName, err.lineNumber);

  if (err.status) {
    res.status(err.status).send(err.name);
    next();
    return;
  }


  if (Object.keys(req.body).length === 0 || err.name === 'ValidationError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};
