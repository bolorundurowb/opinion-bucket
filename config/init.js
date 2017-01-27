/**
 * Created by bolorundurowb on 1/27/17.
 */

const User = require('./../src/server/models/user');
const config = require('./config');
const mongoose = require('mongoose');
mongoose.connect(config.database);

User.findOne({username: 'admin'}, function (err, admin) {
  if (err) {
    console.log('err: ', err);
    mongoose.disconnect();
  } else if (!admin) {
    admin = new User({
      username: 'admin',
      password: process.env.ADMIN_PASS,
      email: 'admin@opinionbucket.io',
      type: 'Admin'
    });
    admin.save(function (err) {
      if (err) {
        console.log('err: ', err);
      }
      mongoose.disconnect();
    });
  } else {
    mongoose.disconnect();
  }
});

