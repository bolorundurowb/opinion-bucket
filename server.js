/**
 * Created by bolorundurowb on 11/11/16.
 */

const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./src/server/routes/routes');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
  dotenv.config({silent: true});
}

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

// prefix the path with /api/v{version}
server.use('/api/v1', router);

// handle unmatched routes
server.use((req, res, next) => {
  res.status(501).send({
    status: 'failed',
    message: 'This API doesn\'t support that function'
  });
  next();
});

// set the API port
const port = process.env.PORT || 8080;

// start the server
server.listen(port);

// indicate server status
// eslint-disable-next-line
console.log('Server started on port: ' + port);

// expose server to test
module.exports = server;

