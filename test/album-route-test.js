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
const Album = require('../model/band/album.js');
const templates = require('./lib/templates.js');

require('../server.js')
let url = templates.url; 

describe('Album Route Tests', function() {
  before(done => {
    authenticateUser('user')
    .then(() => storeModel(Band, 'band', 'user'))
    .then(() => done())
    .catch(err => done(err));
  })

  after(done => {
    Promise.all([
      User.remove({}),
      Account.remove({}),
      Band.remove({}),
      Album.remove({})
    ])
    .then(() => {
      delete helper.users.user;
      delete helper.storedItem.band;
      delete helper.accounts.user;
      delete helper.tokens.user;
      done();
    })
    .catch(err => done(err));
  })

  describe('POST /api/album', function() {
    describe('With a valid body and header', function() {
      it('Should return a 200 code and req.body', done => {
        request.post(`${url}/api/album`)
        .send(templates.album)
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200)
          expect(res.body.userID).to.equal(helper.users.user._id.toString())
          expect(res.body.title).to.equal(templates.album.title);
          done();
        });
      });
    });

    describe('With an invalid header', function() {
      it('Should return a 401 code', done => {
        request.post(`${url}/api/album`)
        .send(templates.album)
        .set({
          Authorization: `Bearer stuff`
        })
        .end((err) => {
          expect(err.status).to.equal(401)
          done();
        });
      });
    });

    describe('With an invalid body', function() {
      it('Should return a 404 code', done => {
        request.post(`${url}/api/album`)
        .send({this: 'wont work'})
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err) => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
  });
});

describe('GET /api/album/id', function() {
  before(done => {
    authenticateUser('user')
    .then(() => storeModel(Album, 'album', 'user'))
    .then(() => done())
    .catch(err => done(err));
  })

  describe('With a valid id', function() {
    it('Should return a 200 code and req.body', done => {
      request.get(`${url}/api/album/${helper.storedItem.album._id}`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200)
        expect(res.body.userID).to.equal(helper.users.user._id.toString())
        expect(res.body.title).to.equal(templates.album.title);
        done();
      });
    });
  });

  describe('With an invalid ID', function() {
    it('Should return a 404 code', done => {
      request.get(`${url}/api/album/stuff`)
      .end((err) => {
        expect(err.status).to.equal(404);
        done();
      });
    });
  });

  describe('DELETE /api/album/id', function() {
    describe('With a valid id and header', function() {
      before(done => {
        storeModel(Album, 'album', 'user')
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        Promise.all([
          User.remove({}),
          Album.remove({}),
          Account.remove({}),
        ])
        .then(() => {
          delete helper.users.user;
          delete helper.storedItem.album;
          delete helper.tokens.user;
          delete helper.accounts.user;
          done();
        })
        .catch(err => done(err));
      })

      it('Should return a 204 code', done => {
        request.delete(`${url}/api/album/${helper.storedItem.album._id}`)
        .set({
          Authorization: `Bearer ${helper.tokens.user}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        })
      })
    })
  })
});