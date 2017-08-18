# Overview

  * This RESTful API provides the back-end infrastructure and functionality to create, read, update, and delete data related to Band 'Users' and venues.

  *  This API provides a means to connect bands with venues, and then to serve their data after booking to the public for consumption.  It provides an infrastructure and data persistence that can be consumed by applications using reliable standards of a RESTful API.  In providing this API and the infrastructure associated with it, we encourage developers to create applications that can provide value to the live music community, and give them a tool to better organize and streamline the process of booking and promoting live music.

  ---

# Current Version (1.0)

  * The current version of this program is designed to create, read, update, delete, and return data that is used to connect bands with venues and then serve that data to the public.

  ---

# Way to contribute

  * Reporting Bugs: Open an issue in this git repository and select "bug" as the label.

  * Recommending Improvements: Open up an issue through this git repository and select "improvement" as the label.

  ---

# Architecture

This API is structured on a Model, View, Controller(MVC) architecture pattern.  The base technologies involved are node.js server, node.http module, express middleware, a mongo database, and AWS s3 storage services.  This architecture is currently deployed in a two tiered environment(staging, production), leveraging to the heroku platform.

Middleware:

  * The express router middleware provides the base routing capability.

  * Our own custom middleware module uses to npm modules (bcrypt, jsonwebtoken) and the node.crytpo module to provide user creation and authentication/authorization for our app.

  * The mongoose npm module is used for interacting with our mongo database.

View:  Individual resources(user, album, band...) have dedicated router files located in the route folder.  Also, resources that are specific to a user "profile"(account, booking, message...) are located in the profile directory nested in the route directory.  In addition to providing an interface to the API, these files parse the json content in the incoming request(when applicable) and create/populate a req.body property using the npm package parse-body.

Controller:  Our application's API controls all functionality of our app, as well as interacting with our mongo database to serve our information to the public.

Model:  Individual resources(user, band, track, album...) have dedicated model files.  These files provide the object constructors and the mongoose schema creation syntax.

---

# Schema

##  MVP Schema Diagram

---

<!-- insert Eddie's mind map here -->

---

# Routes

##  Account Routes:

### GET

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization header
  * Provide username and password as json

  This route will require an authorization header that needs to include the username:password of a specific user to be authenticated. Hitting this route will retrieve a specific user ID and associate it to an account.

Example Response:

```{ _id: '599620ff50673f1d2e8330f6',
  userID: '599620ff50673f1d2e8330f5',
  __v: 0,
  video: [],
  photos: [],
  inbox: [],
  bookings: [] }
  ```

### DELETE

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Specific user ID which is provided when you sign up with a post request to api/user.

  This route will allow you to delete an account provided you have the proper permissions.

Example Response:  You will only receive a status code of 204 when a successful deletion is made.

---

##  Booking Routes:

### POST

Example URL:  /*insert example URL here*/

Required Data:  

  * Authorization Header
  * Must create a user account and determine if you are a band or venue, then the API will give a corresponding ID.

  This endpoint will allow venues to request a booking from specific bands based off their user ID provided they have the proper permissions.

Example Response: ```{ __v: 0,
  venueUserID: '5996229e34afbb1dbe205b42',
  bandUserID: '5996229e34afbb1dbe205b40',
  _id: '5996229e34afbb1dbe205b46',
  venueConfirm: false,
  bandConfirm: false,
  date: '2017-08-17T23:11:24.723Z' }
  ```

### GET

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Venue ID or Band ID

  This endpoint will allow users to get meta data about bookings with venues and bands provided they have the proper permissions.

Example Response: ```{ _id: '599622cddf0ffc0e6847f031',
  venueUserID: '599622cddf0ffc0e6847f02b',
  bandUserID: '599622cddf0ffc0e6847f029',
  __v: 0,
  venueConfirm: false,
  bandConfirm: false,
  date: '2017-08-17T23:12:12.688Z' }
  ```

### GET

Example URL:  /*insert example URL here*/

Required Data:

  * Booking ID

  This endpoint will allow the public to look up a specific booking based of its booking ID.

Example Response: ```{ _id: '5996232f85ea071e21c9e138',
  venueUserID: '5996232f85ea071e21c9e131',
  bandUserID: '5996232e85ea071e21c9e12f',
  __v: 0,
  date: '2017-08-17T23:13:49.660Z' }
  ```

###  PUT

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Band ID or Venue ID

  This endpoint will allow band or venues to update certain circumstances of the booking(date, compensation...), provided they have the proper permissions.

Example Response: ```{ _id: '59962d6dc5271020db16b3b3',
  venueUserID: '59962d6cc5271020db16b3ab',
  bandUserID: '59962d6cc5271020db16b3a9',
  __v: 0,
  venueConfirm: false,
  bandConfirm: false,
  date: '1970-01-01T00:01:00.606Z' }
  ```

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Band ID or Venue ID

  This endpoint will allow bands and venues to confirm their updates, and if both IDs confirm TRUE then the changes will be made provided they have the proper permissions.

Example Response: ```{ _id: '5996249fb229831ee43670ab',
  venueUserID: '5996249fb229831ee43670a2',
  bandUserID: '5996249fb229831ee43670a0',
  __v: 0,
  venueConfirm: false,
  bandConfirm: true,
  date: '2017-08-17T23:19:57.855Z' }
  ```

##  DELETE

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Band ID or Venue ID

  This endpoint will allow bands and venues to delete bookings provided they have the proper permissions.

Example Response:  You will only receive a status code of 204 when a successful deletion is made.

  ---

##  Message Routes:

### POST

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * User ID
  * Sender ID
  * Content(must be a string)

  This endpoint will allow users to send messages to each other using their ID as a parameter provided they have the proper permissions.

Example Response: ```{ __v: 0,
  content: 'Thist is a test. It will probably fail :D. But if it doesn\'t, that\'sgreat!!!',
  userID: '599638d299eaed250058979e',
  senderID: '599638d299eaed250058979c',
  _id: '599638d299eaed25005897a0',
  dateSent: '2017-08-18T00:46:10.782Z' }
  ```

### DELETE

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Message ID
  * User ID

  This endpoint will allow users to delete messages that are posted to their account provided that they have the proper permissions.

Example Response:  You will only receive a status code of 204 when a successful deletion is made.

---

##  Album Routes:

### POST

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Album Title(string)
  * User ID

  This endpoint will allow Users to post new album objects that will populate with tracks as referenced by the track schema object provided they have the proper permissions.

Example Response: ```{ __v: 0,
  title: 'fogofwar',
  userID: '59963b3466bdcc25da9ce2c1',
  _id: '59963b3466bdcc25da9ce2c4',
  tracks: [],
  datePublished: '2017-08-18T00:56:19.374Z' }
  ```

### GET

Example URL:  /*insert example URL here*/

Required Data:

  * Album ID

This endpoint will allow the public to request an album from our database based off the Album ID.

Example Response: ```{ _id: '59963d2debbe74268e12a382',
  userID: '59963d2debbe74268e12a37d',
  title: 'fogofwar',
  __v: 0,
  tracks: [],
  datePublished: '2017-08-18T01:04:44.132Z' }
  ```

### PUT

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * User ID
  * Request body changes

  This endpoint will allow Users to update Album information providing they have the proper permissions.

Example Response:

### DELETE

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Album ID
  * User ID

  This endpoint will allow Users to delete albums provided that they have the proper permissions.

Example Response: You will only receive a status code of 204 when a successful deletion is made.

---

## Band Routes:

### GET

Example URL:  /*insert example URL here*/

Required Data:

  * Band ID

  This endpoint will allow the public to request a band associated with its specific band id.

Example Response: ```{ _id: '599624ddbe91be0f51b448b6',
  venueUserID: '599624dcbe91be0f51b448af',
  bandUserID: '599624dcbe91be0f51b448ad',
  __v: 0,
  venueConfirm: false,
  bandConfirm: false,
  date: '2017-08-17T23:20:59.854Z' }
  ```

### POST

Example URL:  /*insert example URL here*/

Data Requirements:

  * Authorization Header
  * Band Name(string)
  * Genre(string)
  * User ID

  This endpoint will allow users to post new bands with a band name and a genre, providing they have the proper permissions.

Example Response: ```{ _id: '599624ddbe91be0f51b448b6',
venueUserID: '599624dcbe91be0f51b448af',
bandUserID: '599624dcbe91be0f51b448ad',
__v: 0,
venueConfirm: false,
bandConfirm: false,
date: '2017-08-17T23:20:59.854Z' }
```

### PUT

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * User ID
  * Request Body with user changes

  This endpoint will allow Users to update band objects providing they have the proper permissions.

Example Response: ```{ _id: '59964cfd920cbb3a2090a5f3',
  userID: '59964cfd920cbb3a2090a5ee',
  name: 'slayer',
  genre: 'thras metal',
  __v: 0,
  albums: [],
  members: [] }
  ```

---

##  Track Routes:

### POST

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Album ID
  * User ID
  * Track title(string)

  This endpoint will allow Users to upload audio files to AWS s3 storage providing they have the proper permissions.

Example Response: ```{ __v: 0,
  title: 'trillville',
  url: 'http://localhost:1234',
  userID: '599653b873e392464a169e85',
  albumID: '599653b973e392464a169e88',
  awsKey: '8c41ce1a6d7966302c430cd22263fb8f.mp3',
  awsURI: 'https://cf-giggle-app.s3.amazonaws.com/8c41ce1a6d7966302c430cd22263fb8f.mp3',
  _id: '599653ba73e392464a169e89' }
  ```

### DELETE

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * User ID
  * Album ID
  * Track ID

  This endpoint will allow Users to delete specific audio files from AWS s3 storage providing they have the proper permissions.

Example Response: You will only receive a status code of 204 when a successful deletion is made.

---

##  Venue Routes:

### GET

Example URL:  /*insert example URL here*/

Required Data:

  * Venue name(string)

  This endpoint allows the public to look up Venues based off a string that points to a Venue ID.

Example Response: ```{ _id: '5996543c0aeeed46a1ccf8ee',
  userID: '5996543c0aeeed46a1ccf8ea',
  name: 'Hell',
  desc: 'All sorts of sin and stufff',
  __v: 0 }
  ```

### PUT

Example URL:  /*insert example URL here*/

Required Data:

  * Authorization Header
  * Venue name
  * User ID
  * Request body with updates

  This endpoint will allow Users to update venues with specific changes made in the request body, providing they have the proper permissions.

Example Response: ```{ _id: '599654747d18eb47002be567',
  userID: '599654747d18eb47002be562',
  name: 'Moes Tavern',
  desc: 'All sorts of sin and stufff',
  __v: 0 }
  ```

---

##  User Routes:

### POST

Example URL:  /*insert example URL here*/

Required Data:

  * username
  * email
  * password
  * account ID

  This endpoint allows the public to sign up as a user and create a account with a username, ID and a password associated with that ID.

Example Response: ```{ _id: 59965dd31e8bf4bc07549fce,
  findHash: '9f389bccbd22d8064bd21ff5f57fc66dda35591c71fc74f62976263501a2608d',
  accountID: 59965dd31e8bf4bc07549fcf,
  username: 'steve_jobs',
  email: 'windowsCanSuckIt@apple.com',
  password: '$2a$10$2iMXICQo.NtozblT./HbU.Jjjjk/imCnse4YM.KlRdkM4mD3LSn4i',
  __v: 0,
}
```

### GET

Example URL:  /*insert example URL here*/

Required Data:

  * Basic Authorization Header
  * username
  * password

  This endpoint allows users to login to the application by passing in their unique username and password, providing they have the proper permissions.

Example Response:  hashed out token

  ---

# Testing

  * testing framework mocha test runner
  * chai assertion library
  * bluebird promise library
  * eslint
  * Continuous Integration travis-ci is integrated into this app through the use of the included .travis.yml file.  All pull requests into the staging branch in this repository will launch travis-ci, which then initiates our build with mocha and eslint tests.
  * Coveralls is integrated into this app through the use of a .coveralls.yml file.  Whenever we test with "npm run coveralls", it will sync with github, travis-ci, and coveralls.io to give us our code coverage rate and tell us exactly what is being tested and where.
