'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const helper = require('./lib/hooks.js');
const clearModel = helper.clearModel;
const authenticateUser = helper.authenticateUser;
const storeModel = helper.storeModel;
const templates = require('./lib/templates.js');
const url = templates.url;

require('../server.js')
const Album = require('../model/band/album.js');
const Account = require('../model/account/account.js');
const User = require('../model/user.js');
const Band = require('../model/band/band.js');
const Track = require('../model/band/track.js');

var deleteToken = '';
describe('Track Routes', function () {

  before(done => {
    authenticateUser('user')
    .then(() => storeModel(Band, 'band', 'user'))
    .then(() => storeModel(Album, 'album', 'user'))
    .then(() => done())
    .catch(err => done(err));
  })

  after(done => {
    Promise.all([
      User.remove({}),
      Account.remove({}),
      Band.remove({}),
      Album.remove({}),
      Track.remove({})
    ])
    .then(() => {
      delete helper.users.user;
      delete helper.storedItem.band,
      delete helper.accounts.user,
      delete helper.tokens.user
      done();
    })
    .catch(err => done(err));
  });

  describe('POST /api/album/:id/track', () => {
    describe('when provided a valid track', () => {
      it('responds with a track', (done) => {
        request.post(`${url}/api/album/${helper.storedItem.album._id}/track`)
          .set({
            Authorization: `Bearer ${helper.tokens.user}`
          })
          .field('title', templates.track.title)
          .field('url', templates.track.url)
          .attach('soundFile', templates.track.soundFile)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.title).to.equal(templates.track.title);
            expect(res.body.url).to.equal(templates.track.url);
            expect(res.body.albumID).to.equal(helper.storedItem.album._id.toString());
            expect(res.body.userID).to.equal(helper.users.user._id.toString());
            helper.tokens.trackID = res.body._id
            done();
          });
      });
    });
  });

  describe('DELETE /api/album/:albumID/track/:trackID', function () {
    describe('when given a valid id and token', function () {
      it('deletes the item from the db and aws', (done) => {
        request.delete(`${url}/api/album/${helper.storedItem.album._id}/track/${helper.tokens.trackID}`)
          .set({ Authorization: `Bearer ${helper.tokens.user}` })
          .end((err, rsp) => {
            expect(rsp.status).to.equal(204);
            done();
          })
      })
    })
  })
});
