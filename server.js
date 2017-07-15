/**
 * Created by bolorundurowb on 11/11/16.
 */

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./src/server/routes/routes');
const config = require('./src/server/config/config');
const logger = require ('./src/server/config/logger');

// Connect to MongoDB
mongoose.connect(config.database);

// initialize an express object
const server = express();

// create a router object
const router = express.Router();

// direct the router to our routes first
routes(router);

// log requests with morgan
server.use(morgan('dev'));

// parse the payload
server.use(bodyParser.urlencoded({ extended : true }));
server.use(bodyParser.json());

// prefix the path with /api/v{version}
server.use('/api/v1', router);

// handle unmatched routes
server.use(function (req, res, next) {
  res.status(501).send({
    status: 'failed',
    message: 'This API doesn\'t support that function'
  });
  next();
});

// set the API port
const port = process.env.PORT || 4321;

// start the server
server.listen(port);

// indicate server status
logger.log('Server started on port: ' + port);

// expose server to test
module.exports = server;

