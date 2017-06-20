/**
 * Created by bolorundurowb on 1/13/17.
 */

const dotenv = require('dotenv');

var env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  dotenv.config({silent: true});
}

var config = {
  database: '',
  secret: process.env.SECRET
};

if (env === 'development') {
  config.database = process.env.DEV_DB;
} else if (env === 'test') {
  config.database = process.env.TEST_DB;
} else {
  config.database = process.env.PROD_DB;
}

module.exports = config;
