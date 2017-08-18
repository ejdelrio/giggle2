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

require('../server.js');

describe('User route test', function() {
  describe('POST /api/signup', function() {
    describe('With a proper req.body', function() {
      after(done => {
        Promise.all([
          User.remove({}),
          Account.remove({})
        ])
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a  token', done => {
        request.post(`${templates.url}/api/signup`)
        .send(templates.user)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          console.log(res.body)
          done();
        })
      })
    })

    describe('With an improper req.body', function() {
      after(done => {
        Promise.all([
          User.remove({}),
          Account.remove({})
        ])
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a 400 error', done => {
        request.post(`${templates.url}/api/signup`)
        .send({})
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        })
      })
    })
  })

  describe('GET /api/login', function() {
    before(done => {
      authenticateUser('user')
      .then(() => done())
      .catch(err => done(err))
    })

    after(done => {
      Promise.all([
        User.remove({}),
        Account.remove({})
      ])
      .then(() => done())
      .catch(err => done(err))
    })

    describe('With a valid login and header', function() {
      it('should return a user in the req.body', done => {
        request(`${templates.url}/api/login`)
        .auth(templates.user.username, templates.user.password)
        .end((err, res) => {
          if(err) return done(err);
          done();
        })
      })
    })
  })
})