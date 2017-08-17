#Overview

  * This RESTful API provides the back-end infrastructure and functionality to create, read, update, and delete data related to Band 'Users' and venues.

  *  This API provides a means to connect bands with venues, and then to serve their data after booking to the public for consumption.  It provides an infrastructure and data persistence that can be consumed by applications using reliable standards of a RESTful API.  In providing this API and the infrastructure associated with it, we encourage developers to create applications that can provide value to the live music community, and give them a tool to better organize and streamline the process of booking and promoting live music.

  ---

#Current Version (1.0)

  * The current version of this program is designed to create, read, update, delete, and return data that is used to connect bands with venues and then serve that data to the public.

  ---

#Way to contribute

  * Reporting Bugs: Open an issue in this git repository and select "bug" as the label.

  * Recommending Improvements: Open up an issue through this git repository and select "improvement" as the label.

  ---

#Architecture

This API is structured on a Model, View, Controller(MVC) architecture pattern.  The base technologies involved are node.js server, node.http module, express middleware, a mongo database, and AWS s3 storage services.  This architecture is currently deployed in a two tiered environment(staging, production), leveraging to the heroku platform.

Middleware:

  * The express router middleware provides the base routing capability.

  * Our own custom middleware module uses to npm modules (bcrypt, jsonwebtoken) and the node.crytpo module to provide user creation and authentication/authorization for our app.

  * The mongoose npm module is used for interacting with our mongo database.

View:  Individual resources(user, album, band...) have dedicated router files located in the route folder.  Also, resources that are specific to a user "profile"(account, booking, message...) are located in the profile directory nested in the route directory.  In addition to providing an interface to the API, these files parse the json content in the incoming request(when applicable) and create/populate a req.body property using the npm package parse-body.

Controller:  Our application's API controls all functionality of our app, as well as interacting with our mongo database to serve our information to the public.

Model:  Individual resources(user, band, track, album...) have dedicated model files.  These files provide the object constructors and the mongoose schema creation syntax.

---

#Schema

##MVP Schema Diagram

---

<!-- insert Eddie's mind map here -->

---

#Routes

##POST

Example url:

Required Data:

  * insert required data here

##GET

Example url:

Required Data:

  * insert required data here

##PUT

Example url:

Required Data:

  * insert required data here

##DELETE

Example url:

Required Data:

  * insert required data here

  ---

#Testing

  * Testing Framework mocha test runner
  * chai assertion library
  * bluebird promise library
  * eslint
  * Continuous Integration travis-ci is integrated into this app through the use of the included .travis.yml file.  All pull requests into the staging branch in this repository will launch travis-ci, which then initiates our build with mocha and eslint tests.
  * Coveralls is integrated into this app through the use of a .coveralls.yml file.  Whenever we test with "npm run coveralls", it will sync with github, travis-ci, and coveralls.io to give us our code coverage rate and tell us exactly what is being tested and where.
