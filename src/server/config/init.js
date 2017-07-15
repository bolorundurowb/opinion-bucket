/**
 * Created by bolorundurowb on 1/27/17.
 */

const seeder = require('mongoose-seed');
const config = require('./config');
const logger = require('./logger');
const User  = require('./../models/user');

seeder.connect(config.database, function () {
  User.findOne({username: 'admin'}, function (err, user) {
    if (err) {
      logger.error(err);
      logger.log('An error occurred when retrieving the user');

      process.exit(1);
    } else if (!user) {
      const user = new User({
        username: 'admin',
        password: process.env.ADMIN_PASS,
        email: 'admin@opinionbucket.io',
        type: 'Admin'
      });

      user.save(function (err) {
        if (err) {
          logger.error(err);
          logger.log('An error occurred when retrieving the user');

          process.exit(1);
        } else {
          logger.log('The default admin added successfully');

          process.exit(0);
        }
      })
    } else {
      logger.log('default admin already exists');

      process.exit(0);
    }
  })
});
