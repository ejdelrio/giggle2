'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const helper = require('./lib/hooks.js');
const clearModel = helper.clearModel;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;
const User = require('../model/user.js');
const Account = require('../model/account/account.js');
const templates = require('./lib/templates.js');
let url = templates.url;

describe('Account Route TESTS', function() {
  describe('GET /api/account/', function() {
    describe('With a valid user', function() {
      before(done => {
        authenticateUser('user')
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        helper.clearModel(Account, helper.users['user'].accountID)
        .then(() => helper.clearModel(User, helper.users['user']._id))
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a req.body and 200 code', done => {
        request.get(`${url}/api/account`)
        .set({
          Authorization: `Bearer ${helper.tokens['user']}`
        })
        .end((err, res) => {
          if(err) done(err);
          expect(res.status).to.equal(200);
          done();
        })
      })
    })

    describe('With a valid user', function() {
      before(done => {
        authenticateUser('user')
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        clearModel(Account, helper.users['user'].accountID)
        .then(() => clearModel(User, helper.users['user']._id))
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a 401 error code', done => {
        request.get(`${url}/api/account`)
        .set({
          Authorization: `Bearer 6666666666}`
        })
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    })
  })
  describe('DELETE /api/account', function() {
    describe('With a valid user', function() {
      before(done => {
        authenticateUser('user')
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        helper.clearModel(Account, helper.users['user'].accountID)
        .then(() => helper.clearModel(User, helper.users['user']._id))
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a 204 code', done => {
        request.delete(`${url}/api/account`)
        .set({
          Authorization: `Bearer ${helper.tokens['user']}`
        })
        .end((err, res) => {
          if(err) done(err);
          expect(res.status).to.equal(204);
          done();
        })
      })
    })
  })
})