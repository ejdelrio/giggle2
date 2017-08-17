'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const debug = require('debug')('giggle:server.js');

const app = express();
const errors = require('./lib/error.js');
const PORT = process.env.PORT || 4000;

const userRoutes = require('./route/user-route.js');
const accountRoutes = require('./route/account/account-route.js');
const messageRoutes = require('./route/account/message-route.js');
const bandRoutes = require('./route/band/band-route.js');
const albumRoutes = require('./route/band/album-route.js');
const venueRoutes = require('./route/venue/venue-route.js');
const bookingRoutes = require('./route/account/booking-route.js');


dotenv.load();
mongoose.connect(process.env.MONGODB_URI);

app.use(morgan('dev'));
app.use(cors());
app.use(userRoutes);
app.use(accountRoutes);
app.use(messageRoutes);
app.use(bandRoutes);
app.use(venueRoutes);
app.use(bookingRoutes);
app.use(albumRoutes);
app.use(errors);

app.listen(PORT, () => {
  debug('Active on port: ', PORT);
});