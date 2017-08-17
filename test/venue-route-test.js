'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const helper = require('./lib/hooks.js');
const clearModel = helper.clearModel;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;
const templates = require('./lib/templates.js');
const url = templates.url;

const User = require('../model/user.js');
const Account = require('../model/account/account.js');
const Venue = require('../model/venue/venue.js');

describe('Venue Route Tests', function() {
  before(done => {
    authenticateUser('user')
    .then(() => done())
    .catch(err => next(err))
  }); 

  after(done => {
    Promise.all([
      User.remove({}),
      Account.remove({}),
    ])
    .then(() => {
      delete helper.users.user;
      delete helper.accounts.user;
      done();
    })
  });

  describe('POST /api/band/false', function() {
    describe('With a valid userID and body', function() { 
      after(done => {
        Venue.remove({})
        .then(() => done())
        .catch(err => done(err))
      })

      it('Should return a valid 200 code and req.body', done => {
        request.post(`${url}/api/band/false`)
        .send(templates.venue)
        .set({
          Authorization: `Bearer ${helper.tokens.user}` 
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(templates.venue.name)
          done();
        })
      })
    })

    describe('With an invalid body', function() {
      it('Should return a 404', done => {
        request.post(`${url}/api/band/false`)
        .send({bad: 'REQBODY'})
        .set({
          Authorization: `Bearer ${helper.tokens.user}` 
        })
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        })
      })
    })

    describe('With an invalid header', function() {
      it('Should return a 404', done => {
        request.post(`${url}/api/band/false`)
        .send(templates.venue)
        .set({
          Authorization: `Bearer milksteak` 
        })
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    })
  })


  describe('GET /api/venue/:id', function() {

    describe('With a valid id', function() {
      before(done => {
        storeModel(Venue, 'venue', 'user')
        .then(() => done())
        .catch(err => done(err));
      })
      it('Should return a 200 code and valid req.body', done => {
        request.get(`${url}/api/venue/${helper.storedItem.venue._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(helper.storedItem.venue.name);
          expect(res.body._id).to.equal(helper.storedItem.venue._id.toString());
          expect(res.body.userID).to.equal(helper.users.user._id.toString());
          done()
        })
      })
    })

    describe('With an invalid ID', function() {
      it('Should return a 200 code and valid req.body', done => {
        request.get(`${url}/api/venue/I<3garbage`)
        .end((err, res) => {
          expect(err.status).to.equal(404);
          done()
        })
      })
    })
  })
  before(done => {
    storeModel(Venue, 'venue', 'user')
    .then(() => done())
    .catch(err => done(err))
  }); 

  after(done => {
    Promise.all([
      User.remove({}),
      Account.remove({}),
      Venue.remove({})
    ])
    .then(() => {
      delete helper.users.user;
      delete helper.accounts.user;
      delete helper.storedItem.venue
      done();
    })
  });

  describe('PUT /api/band/id', function() {
    describe('with a valid req.body, id and header', function() {

      before(done => {
        storeModel(Venue, 'venue', 'user')
        .then(() => done())
        .catch(err => done(err))
      }); 

      it('Should return a 200 code and req.body', done => {
        request.put(`${url}/api/venue/${helper.storedItem.venue._id}`)
        .send({name: 'Moes Tavern'})
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('Moes Tavern');
          expect(res.body._id).to.equal(helper.storedItem.venue._id.toString());
          done();
        })
      })
    })
    describe('with an invalid header', function() {
      
      before(done => {
        storeModel(Venue, 'venue', 'user')
        .then(() => done())
        .catch(err => done(err))
      }); 

      it('Should return a 200 code and req.body', done => {
        request.put(`${url}/api/venue/${helper.storedItem.venue}`)
        .send({name: 'Moes Tavern'})
        .set({
          Authorization: `Bearer 10101010101`
        })
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    })

    describe('with an invalid ID', function() {
      
      before(done => {
        storeModel(Venue, 'venue', 'user')
        .then(() => done())
        .catch(err => done(err))
      }); 

      it('Should return a 200 code and req.body', done => {
        request.put(`${url}/api/venue/666666`)
        .send({name: 'Moes Tavern'})
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
});