/**
 * Created by bolorundurowb on 11/11/16.
 */

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
  dotenv.config({silent: true});
}

// initialize an express object
const server = express();

// create a router object
const router = express.Router();

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
export default server;

