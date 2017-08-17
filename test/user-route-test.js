'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const templates = require('./lib/templates.js');
const User = require('../model/user.js');
const Account = require('../model/account/account.js');

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
})