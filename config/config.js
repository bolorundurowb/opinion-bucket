/**
 * Created by bolorundurowb on 1/13/17.
 */

const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';
if (env !== 'production') {
  dotenv.config({ silent: true });
}

const config = {
  database: process.env.MONGO_URL,
  secret: process.env.SECRET
};

if (env === 'test') {
  config.database = process.env.MONGO_TEST_URL;
}

module.exports = config;
