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
const templates = require('./lib/templates.js');
require('../server.js')
let url = templates.url; 



describe('Band Route Tests', function() {
  before(done => {
    authenticateUser('user')
    .then(() => done())
    .catch(err => done(err))
  })

  after(done => {
    User.remove({})
    .then(() => Account.remove({}))
    .then(() => done())
    .catch(err => next(err));
  })

  describe('POST /api/band/', function() {
    describe('With a valid req.body and header', function() {

      it('Should return a req.body and 200 code', done => {
        request.post(`${url}/api/band/true`)
        .send(templates.band)
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.userID).to.equal(helper.users.user._id.toString());
          expect(res.body.genre).to.equal(templates.band.genre)
          done()
        })
      })
    })

    describe('With an invalid body', function() {
      it('Should return a req.body and 200 code', done => {
        request.post(`${url}/api/band/true`)
        .send({dinner: 'Milk Steak'})
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err) => {
          expect(err.status).to.equal(400);
          done()
        })
      })
    })

    describe('With an invalid token', function() {
      it('Should return a req.body and 200 code', done => {
        request.post(`${url}/api/band/true`)
        .send(templates.band)
        .set({
          Authorization: `Bearer 4montholdmilk`
        })
        .end((err) => {
          expect(err.status).to.equal(401);
          done()
        })
      })
    })
  })


  describe('Get /api/band/id', function() {
    describe('With a valid ID', function() {
      before(done => {
        storeModel(Band, 'band', 'user')
        .then(() => done())
        .catch(err => done(err));
      })
      
      after(done => {
        Band.remove({})
        .then(() => delete helper.storedItem.band)
        .then(() => done())
        .catch(err => done(err));
      })
      
      it('Should return a 200 coode and req.body', done => {
        request.get(`${url}/api/band/${helper.storedItem.band._id}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(templates.band.name);
          done()
        });
      });
    });

    describe('With an invalid ID', function() {
      before(done => {
        storeModel(Band, 'band', 'user')
        .then(() => done())
        .catch(err => done(err));
      })
      
      after(done => {
        Band.remove({})
        .then(() => delete helper.storedItem.band)
        .then(() => done())
        .catch(err => done(err));
      })
      
      it('Should return a 404 code', done => {
        request.get(`${url}/api/band/666`)
        .end((err) => {
          expect(err.status).to.equal(404);
          done()
        });
      });
    });
  });

  describe('PUT /api/band', function() {
    describe('when provide valid band id and body',  function() {
      before(done => {
        storeModel(Band, 'band', 'user')
        .then(() => done())
        .catch(err => done(err));
      })

      it('responds with a changed album', (done) => {
        let update = { name: templates.bandTwo.name, genre: templates.bandTwo.genre, userID: helper.users.user._id };
        request.put(`${url}/api/band`)
        .send(update)
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err, res) => {
          if(err) console.log(err);
          console.log('HERE fucker', update);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(update.name);
          expect(res.body.genre).to.equal(update.genre);
          expect(res.body.userID.toString()).to.equal(update.userID.toString());
          done();
        })
      })
    })
  })
});