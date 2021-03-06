
'use strict';

const debug = require('debug')('cfgram:server-toggle');

module.exports = exports = {};

exports.start = function(server, done) {
  if (!server.isRunning) {
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      debug('server up!');
      done();
    });
    return;
  };
  done();
}

exports.stop = function(server, done) {
  if (server.isRunning) {
    server.close( err => {
      if (err) return done(err);
      server.isRunning = false;
      debug('server down!');
      done();
    });
    return;
  };
  done();
}