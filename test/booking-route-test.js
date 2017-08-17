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
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.bandUserID).to.equal(helper.users.user._id.toString());
          expect(res.body.venueUserID).to.equal(helper.users.secondUser._id.toString());
          done();
        })
      })
    });

    describe('With an invalid target ID', function() {

      it('Should return a 400 code', done => {
        request.post(`${url}/api/booking/somerandomthing`)
        .send(templates.booking)
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end(err => {
          expect(err.status).to.equal(400)
          done();
        })
      })
    });

    describe('With an invalid header', function() {

      it('Should return a 401 code', done => {
        request.post(`${url}/api/booking/${helper.users.secondUser._id}`)
        .send(templates.booking)
        .set({
          Authorization: `Bearer somerandomthing`
        })
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    });
  });

  describe('GET /api/booking/id', function() {

    before(done => {
      let booking = new Booking(templates.booking);
      booking.bandUserID = helper.users.user._id;
      booking.venueUserID = helper.users.secondUser._id;
      booking.save()
      .then(booking => {
        console.log('BBBBBOOOKING', booking)
        this.booking = booking;
        done()
      })
      .catch(err => done(err));
    })

    describe('With a valid ID', () => {
      it('Should return a 200 code a req.body', done => {
        request.get(`${url}/api/booking/${this.booking._id}`)
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.bandUserID).to.equal(helper.users.user._id.toString());
          expect(res.body.venueUserID).to.equal(helper.users.secondUser._id.toString());
          done();
        })
      })
    })

    describe('With an invalid header', () => {
      it('Should return a 401 code', done => {
        request.get(`${url}/api/booking/${this.booking._id}`)
        .set({
          Authorization: `Bearer ooooooooo`
        })
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    })

    describe('With an invalid id', () => {
      it('Should return a 404 code', done => {
        request.get(`${url}/api/booking/somerandomcrap`)
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        })
      })
    })
  })

  describe('GET /api/booking/id', function() {
    
    before(done => {
      let booking = new Booking(templates.booking);
      booking.bandUserID = helper.users.user._id;
      booking.venueUserID = helper.users.secondUser._id;
      booking.save()
      .then(booking => {
        console.log('BBBBBOOOKING', booking)
        this.booking = booking;
        done()
      })
      .catch(err => done(err));
    })

    describe('With a valid ID', () => {
      it('Should return a 200 code a req.body', done => {
        request.get(`${url}/api/public/booking/${this.booking._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.bandUserID).to.equal(helper.users.user._id.toString());
          expect(res.body.venueUserID).to.equal(helper.users.secondUser._id.toString());
          expect(res.body.compensation).to.equal(undefined);
          done();
        })
      })
    })


    describe('With an invalid id', () => {
      it('Should return a 404 code', done => {
        request.get(`${url}/api/public/booking/somerandomcrap`)
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        })
      })
    })
  })
});
