'use strict';

const Router = require('express').Router
const createError = require('http-errors');
const debug = require('debug')('giggle: band router');
const jsonParser = require('body-parser').json();

const bearerAuth = require('../../lib/bearer-auth.js');
const Band = require('../../model/band/band.js');
const Venue = require('../../model/venue/venue.js');

const bandRouter = module.exports = new Router();

bandRouter.get('/api/band/:id', function(req, res, next) {
  debug('GET /api/band/id');

  console.log('YOUUUUUUUUU', req.params.id);

  Band.findById(req.params.id)
  .then(band => res.json(band))
  .catch(err => next(createError(404, err.message)));
});

bandRouter.post('/api/band/:band', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/band/:band');

  if(req.user.bandID || req.user.venueID) return next(createError(400, 'Profile already created!'));

  //isBand is a boolean
  req.body.userID = req.user._id;
  let isBand = JSON.parse(req.params.band);
  let newModel = isBand ? new Band(req.body) : new Venue(req.body);
  isBand ? req.user.bandID = newModel._id : req.user.venueID = newModel._id;

  req.user.save()
  .then(() => newModel.save())
  .then(model => res.json(model))
  .catch(err => next(createError(400, err.message)));

});

bandRouter.put('/api/band', bearerAuth, jsonParser, function(req, res, err) {
  debug('PUT /api/band');

  Band.findOneAndUpdate({userID: req.user._id}, req.body)
  .then(band => res.json(band))
  .catch(err => next(createError404, err.message))
})
