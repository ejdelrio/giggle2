'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: venue router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../../lib/bearer-auth.js');

const User = require('../../model/user.js');
const Venue = require('../../model/venue/venue.js');
const venueRouter = module.exports = new Router();

venueRouter.get('/api/venue/:id', function(req, res, next) {
  debug('GET /api/venue/id');

  Venue.findOne({_id: req.params.id})
  .then(venue => {
    res.json(venue)
  })
  .catch(err => next(createError(404, err.message)));
})

venueRouter.put('/api/venue/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/venue/id');

  console.log('QQQQQQQQQQQQQQQQ     ', req.body)

  Venue.findByIdAndUpdate({
    _id: req.params.id, 
    userID: req.user._id},
    req.body,
    {new: true}
  )
  .then(venue => {
    res.json(venue);
  })
  .catch(err => next(createError(404, err.message)));
})