'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const helper = require('./lib/hooks.js');
const clearModel = helper.clearModel;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;

const User = require('../model/user.js');
const Account = require('../model/account/account.js');
const Message = require('../model/account/message.js');
const templates = require('./lib/templates.js');
let url = templates.url;  

describe('Message Routes Test', function() {
  describe('POST /message/target/', function() {
    describe('With a valid message body, userID and intended target', function() {
      before(done => {
        authenticateUser('user')
        .then(() => authenticateUser('secondUser'))
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        clearModel(Account, helper.users['user']._id)
        .then(() => User.remove({}))
        .then(() => Account.remove({}))
        .then(() => Message.remove({}))
        .then(() => done())
        .catch(err => done(err));
      })

      it('It should return a message and 200 code', done => {
        let target = helper.users.secondUser._id
        let token = helper.tokens['user'];
        request.post(`${url}/api/message/${target}`)
        .send(templates.message)
        .set({
          Authorization: `Bearer ${token}`
        })
        .end((err, res) => {
          if(err) done(err);
          expect(res.status).to.equal(200);
          expect(res.body.content).that.equal(templates.message.content);
          expect(res.body.senderID).to.equal(helper.users.user._id.toString());
          expect(res.body.userID).to.equal(helper.users.secondUser._id.toString());
          done();
        });
      });
    });

    describe('With an invalid user token', function() {
      before(done => {
        authenticateUser('user')
        .then(() => authenticateUser('secondUser'))
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        clearModel(Account, helper.users['user']._id)
        .then(() => User.remove({}))
        .then(() => Account.remove({}))
        .then(() => Message.remove({}))
        .then(() => done())
        .catch(err => done(err));
      })

      it('It should return a 401 code', done => {
        let target = helper.users.secondUser._id
        request.post(`${url}/api/message/${target}`)
        .send(templates.message)
        .set({
          Authorization: `Bearer ${6666}`
        })
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });

    describe('With an invalid message body', function() {
      before(done => {
        authenticateUser('user')
        .then(() => authenticateUser('secondUser'))
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        clearModel(Account, helper.users['user']._id)
        .then(() => User.remove({}))
        .then(() => Account.remove({}))
        .then(() => Message.remove({}))
        .then(() => done())
        .catch(err => done(err));
      })

      it('It should return a message and 200 code', done => {
        let target = helper.users.user._id;
        let token = helper.tokens['secondUser'];
        request.post(`${url}/api/message/${target}`)
        .send(templates.message)
        .set({
          Authorization: `Bearer ThisSHOULDNOTWORK`
        })
        .end((err) => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('DELETE /api/message', function() {
    describe('With valid authorization and id', function() {
      before(done => {
        authenticateUser('user')
        .then(() => authenticateUser('secondUser'))
        .then(() => storeModel(
          Message,
          'message',
          'secondUser',
          {senderID: helper.users.user._id}
        ))
        .then(message => {
          this.message = message
          return Account.findById(helper.users.secondUser.accountID)
        })
        .then(account => {
          account.inbox.push(this.message._id);
          this.account = account;
          account.save();
        })
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        clearModel(Account, helper.users['user']._id)
        .then(() => User.remove({}))
        .then(() => Account.remove({}))
        .then(() => Message.remove({}))
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a 204 status code', done => {
        Account.findById(this.account._id)
        .populate('inbox')
        .then(() => done())
        .catch(err => done(err))
        
      })

    })

    describe('With invalid authorization', function() {
      before(done => {
        authenticateUser('user')
        .then(() => authenticateUser('secondUser'))
        .then(() => storeModel(
          Message,
          'message',
          'secondUser',
          {senderID: helper.users.user._id}
        ))
        .then(message => {
          this.message = message
          return Account.findById(helper.users.secondUser.accountID)
        })
        .then(account => {
          account.inbox.push(this.message._id);
          this.account = account;
          account.save();
        })
        .then(() => done())
        .catch(err => done(err));
      })

      after(done => {
        clearModel(Account, helper.users['user']._id)
        .then(() => User.remove({}))
        .then(() => Account.remove({}))
        .then(() => Message.remove({}))
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a 401 status code :D', done => {
        request.delete(`${url}/api/message/${this.message._id}`)
        .set({
          Authorization: `Bearer 42132341313`
        })
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    })
  })
});
