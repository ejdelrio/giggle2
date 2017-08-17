'use strict';

const expect = require('chai').expect;
const helper = require('./lib/hooks.js');
const clearModel = helper.clearModel;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;
const templates = require('./lib/templates.js');

const User = require('../model/user.js');
const Account = require('../model/account/account.js');
const Band = require('../model/band/band.js');

describe('Helper Hooks module test', function() {
  describe('authenticateUser', function() {
    before(done => {
      User.remove({})
      .then(() => delete helper.users.user)
      .then(() => Account.remove({}))
      .then(() => done())
      .catch(err => done(err));
    })

    after(done => {
      User.remove({})
      .then(() => delete helper.users.user)
      .then(() => Account.remove({}))
      .then(() => done())
      .catch(err => done(err));
    })
    it('should create a new user', done => {
      authenticateUser('user')
      .then(user => {
        expect(user.username).to.equal(templates.user.username)
        done();
      })
      .catch(err => done(err));
    })
  })

  describe('storeModel', function() {

    before(done => {
      authenticateUser('user')
      .then(() => done())
      .catch(err => done(err));
    })
    

    after(done => {
      Band.remove({})
      .then(() => User.remove({}))
      .then(() => delete helper.users.user)
      .then(() => Account.remove({}))
      .then(() => delete helper.storedItem.band)
      .then(() => done())
      .catch(err => done(err));
    })
    it('should create a new band and attach it to the user', done => {
      storeModel(Band, 'band', 'user')
      .then(band => {
        expect(band.name).to.equal(templates.band.name)
        expect(band.genre).to.equal(templates.band.genre)
        done();
      })
      .catch(err => done(err));
    })
  })
})