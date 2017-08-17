'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const helper = require('./lib/hooks.js');
const clearModel = helper.clearModel;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;

const User = require('../model/user.js');
const Account = require('../model/account/account.js');
const Band = require('../model/band/band.js');
const Venue = require('../model/venue/venue.js');
const Booking = require('../model/account/booking.js');
const templates = require('./lib/templates.js');

require('../server.js');
let url = templates.url;

describe('Booking Route Test', function() {

  before(done => {
    authenticateUser('user')
    .then(() => authenticateUser('secondUser'))
    .then(() => storeModel(Band, 'band', 'user'))
    .then(band => {
      helper.users.user.bandID = band._id;
      helper.users.user.save();
    })
    .then(() => storeModel(Venue, 'venue', 'secondUser'))
    .then(venue => {
      helper.users.secondUser.bandID = venue._id;
      helper.users.secondUser.save();
    })
    .then(() => done())
    .catch(err => done(err));

  })

  after(done => {
    Promise.all([
      User.remove({}),
      Account.remove({}),
      Band.remove({}),
      Venue.remove({}),
      Booking.remove({})
    ])
    .then(() => {
      delete helper.users.user;
      delete helper.users.secondUser;
      delete helper.accounts.user;
      delete helper.accounts.secondUser;
      delete helper.tokens.user;
      delete helper.tokens.secondUser;
      done();
    })
    .catch(err => done(err));
  });

  describe('POST /api/booking', function() {
    describe('With a valid req.body, id and header', function() {

      after(done => {
        Booking.remove({})
        .then(() => done())
        .catch(err => done(err));
      });

      it('Should return a 200 code and request body', done => {
        request.post(`${url}/api/booking/${helper.users.secondUser._id}`)
        .send(templates.booking)
        .set({
          Authorization: `Bearer ${helper.token.user}`
        })
        .end((err, res) => {
          if(err) return done(err);
          done();
        })
      })
    });
  });
});