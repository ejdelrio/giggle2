'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle: booking router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const bearerAuth = require('../../lib/bearer-auth.js');
const Booking = require('../../model/account/booking.js');
const Band = require('../../model/band/band.js');
const Venue = require('../../model/venue/venue.js');
const Account = require('../../model/account/account.js');
const User = require('../../model/user.js');

const bookingRotuer = module.exports = new Router();

bookingRotuer.post('/api/booking/:userID', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/booking/userID');

  var tempBooking
  let booking = new Booking(req.body);
  !req.user.bandID ? 
  booking.venueUserID = req.user._id:
  booking.bandUserID = req.user._id;

  (!booking.venueUserID ?
  Venue.findOne({userID: req.params.userID}):
  Band.findOne({userID: req.params.userID}))
  .then(model => {
    !booking.venueUserID ?
    booking.venueUserID = model.userID:
    booking.bandUserID = model.userID;
    tempBooking = booking;
    return booking.save();
  })

  .then(() => Account.findOne({userID: req.user._id}))
  .then(account => {
    account.bookings.push(tempBooking._id);
    return account.save();
  })

  .then(() => Account.findOne({userID: req.params.userID}))
  .then(account => {
    account.bookings.push(tempBooking._id);
    return account.save();
  })

  .then(() => res.json(tempBooking))
  .catch(err => next(createError(400, err.message)));
});

bookingRotuer.get('/api/booking/:id', bearerAuth, function(req, res, next) {
  debug('GET /api/booking/id');

  if(!req.user.bandID && !req.user.venueID) return next(createError(401, 'Not authorized!!!'));
  (!req.user.bandID ?
  Booking.findOne({venueUserID: req.user._id, _id: req.params.id}):
  Booking.findOne({bandUserID: req.user._id, _id: req.params.id}))
  .then(booking => res.json(booking))
  .catch(err => next(createError(404, err.message)));
})

bookingRotuer.get('/api/public/booking/:id', function(req, res, next) {
  debug('GET /api/booking/id');

  Booking.findById(req.params.id)
  .then(booking => {
    delete booking.compensation;
    res.json(booking);
  })
  .catch(err => next(createError(404, err.message)));
})