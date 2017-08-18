'use strict';

const Router = require('express').Router;
const debug = require('debug')('giggle:album router')
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const bearerAuth = require('../../lib/bearer-auth.js');
const Album = require('../../model/band/album.js');
const Band = require('../../model/band/band.js');

const albumRouter = module.exports = new Router();

albumRouter.post('/api/album', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/band');

  req.body.userID = req.user._id;
  let newAlbum = new Album(req.body);

  Band.findOne({userID: req.user._id})
  .then(band => {
    band.albums.push(newAlbum._id);
    return band.save();
  })
  .then(() => newAlbum.save())
  .then(() => res.json(newAlbum))
  .catch(err => next(createError(400, err.message)));


})

albumRouter.get('/api/album/:id', function(req, res, next) {
  debug('GET /api/album/id');

  Album.findById(req.params.id)
  .then(band => res.json(band))
  .catch(err => next(createError(404, err.message)));
})

albumRouter.put('/api/album/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT /api/album/id');
  console.log('Fuck this   stupid teest', req.user)
  Album.findOneAndUpdate({
    userID: req.user._id, 
    _id : req.params.id
  }, req.body,
    {new: true})
  .then(album => res.json(album))
  .catch(err => next(createError(404, err.message)));
})

albumRouter.delete('/api/album/:id', bearerAuth, function(req, res, next) {
  debug('DELETE /api/band/id');

    Album.findOneAndRemove({_id: req.params.id, userID: req.user._id})
    .then(() => {
      res.status(204);
      res.send('Album deleted');
      res.end();
    })
    .catch(err => next(createError(404, err.message)));

})